import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { doctorsTable } from "@workspace/db";
import { eq, or, and, ne } from "drizzle-orm";
import { DoctorLoginBody } from "@workspace/api-zod";
import bcrypt from "bcryptjs";
import { z } from "zod";

const router: IRouter = Router();

router.post("/login", async (req, res) => {
  const parsed = DoctorLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "VALIDATION_ERROR", message: "Invalid request body" });
    return;
  }

  const { username, password } = parsed.data;

  try {
    const [doctor] = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.username, username))
      .limit(1);

    if (!doctor) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid username or password" });
      return;
    }

    const passwordValid = await bcrypt.compare(password, doctor.password);

    if (!passwordValid) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid username or password" });
      return;
    }

    req.session.doctorId = doctor.id;
    req.session.doctorName = doctor.name;

    res.json({
      doctor: {
        id: doctor.id,
        username: doctor.username,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty ?? undefined,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/me", async (req, res) => {
  const doctorId = req.session.doctorId;
  if (!doctorId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Not authenticated" });
    return;
  }

  try {
    const [doctor] = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.id, doctorId))
      .limit(1);

    if (!doctor) {
      req.session.destroy(() => {});
      res.status(401).json({ error: "UNAUTHORIZED", message: "Session invalid" });
      return;
    }

    res.json({
      id: doctor.id,
      username: doctor.username,
      name: doctor.name,
      email: doctor.email,
      specialty: doctor.specialty ?? undefined,
    });
  } catch (err) {
    req.log.error({ err }, "Get me error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

const UpdateProfileBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  username: z.string().min(3).max(100),
  specialty: z.string().optional(),
});

const ChangePasswordBody = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1),
});

router.put("/profile", async (req, res) => {
  const doctorId = req.session.doctorId;
  if (!doctorId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Not authenticated" });
    return;
  }

  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "VALIDATION_ERROR", message: "Invalid request body" });
    return;
  }

  const { name, email, username, specialty } = parsed.data;

  try {
    const [existing] = await db
      .select({ id: doctorsTable.id })
      .from(doctorsTable)
      .where(
        and(
          ne(doctorsTable.id, doctorId),
          or(eq(doctorsTable.username, username), eq(doctorsTable.email, email))
        )
      )
      .limit(1);

    if (existing) {
      res.status(409).json({ error: "CONFLICT", message: "Username or email already taken" });
      return;
    }

    const [updated] = await db
      .update(doctorsTable)
      .set({ name, email, username, specialty: specialty ?? null })
      .where(eq(doctorsTable.id, doctorId))
      .returning();

    if (!updated) {
      req.session.destroy(() => {});
      res.status(401).json({ error: "UNAUTHORIZED", message: "Session invalid" });
      return;
    }

    req.session.doctorName = updated.name;

    res.json({
      id: updated.id,
      username: updated.username,
      name: updated.name,
      email: updated.email,
      specialty: updated.specialty ?? undefined,
    });
  } catch (err) {
    const dbErr = err as { code?: string; constraint?: string };
    if (dbErr?.code === "23505") {
      res.status(409).json({ error: "CONFLICT", message: "Username or email already taken" });
      return;
    }
    req.log.error({ err }, "Update profile error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.put("/password", async (req, res) => {
  const doctorId = req.session.doctorId;
  if (!doctorId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Not authenticated" });
    return;
  }

  const parsed = ChangePasswordBody.safeParse(req.body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    res.status(400).json({ error: "VALIDATION_ERROR", message: firstIssue?.message ?? "Invalid request body" });
    return;
  }

  const { currentPassword, newPassword, confirmPassword } = parsed.data;

  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: "VALIDATION_ERROR", message: "New passwords do not match" });
    return;
  }

  try {
    const [doctor] = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.id, doctorId))
      .limit(1);

    if (!doctor) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Session invalid" });
      return;
    }

    const passwordValid = doctor.password.startsWith("$2")
      ? await bcrypt.compare(currentPassword, doctor.password)
      : doctor.password === currentPassword;

    if (!passwordValid) {
      res.status(400).json({ error: "INVALID_PASSWORD", message: "Current password is incorrect" });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await db
      .update(doctorsTable)
      .set({ password: hashed })
      .where(eq(doctorsTable.id, doctorId));

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Change password error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;

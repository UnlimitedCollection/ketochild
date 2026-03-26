import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { doctorsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { DoctorLoginBody } from "@workspace/api-zod";
import bcrypt from "bcryptjs";

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

    const passwordValid = doctor.password.startsWith("$2")
      ? await bcrypt.compare(password, doctor.password)
      : doctor.password === password;

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
        specialty: doctor.specialty,
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
      specialty: doctor.specialty,
    });
  } catch (err) {
    req.log.error({ err }, "Get me error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;

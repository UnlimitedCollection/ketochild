import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { doctorsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { DoctorLoginBody } from "@workspace/api-zod";

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

    if (!doctor || doctor.password !== password) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid username or password" });
      return;
    }

    (req.session as Record<string, unknown>).doctorId = doctor.id;
    (req.session as Record<string, unknown>).doctorName = doctor.name;

    res.json({
      doctor: {
        id: doctor.id,
        username: doctor.username,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
      },
      token: `session-${doctor.id}`,
    });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out successfully" });
  });
});

router.get("/me", async (req, res) => {
  const doctorId = (req.session as Record<string, unknown>).doctorId as number | undefined;
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

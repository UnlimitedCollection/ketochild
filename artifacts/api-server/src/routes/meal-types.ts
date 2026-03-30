import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { mealTypesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const types = await db
      .select()
      .from(mealTypesTable)
      .orderBy(asc(mealTypesTable.id));
    res.json(types);
  } catch (err) {
    req.log.error({ err }, "List meal types error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "INVALID_INPUT", message: "Name is required" });
      return;
    }
    const [created] = await db
      .insert(mealTypesTable)
      .values({ name: name.trim() })
      .returning();
    res.status(201).json(created);
  } catch (err) {
    const dbErr = err as { code?: string };
    if (dbErr?.code === "23505") {
      res.status(409).json({ error: "DUPLICATE", message: "A meal type with that name already exists" });
      return;
    }
    req.log.error({ err }, "Create meal type error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ error: "INVALID_INPUT", message: "Invalid meal type ID" });
      return;
    }
    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "INVALID_INPUT", message: "Name is required" });
      return;
    }
    const [updated] = await db
      .update(mealTypesTable)
      .set({ name: name.trim() })
      .where(eq(mealTypesTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "NOT_FOUND", message: "Meal type not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    const dbErr = err as { code?: string };
    if (dbErr?.code === "23505") {
      res.status(409).json({ error: "DUPLICATE", message: "A meal type with that name already exists" });
      return;
    }
    req.log.error({ err }, "Update meal type error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ error: "INVALID_INPUT", message: "Invalid meal type ID" });
      return;
    }
    const [deleted] = await db
      .delete(mealTypesTable)
      .where(eq(mealTypesTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "NOT_FOUND", message: "Meal type not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Delete meal type error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;

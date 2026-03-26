import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { libraryMealPlansTable, libraryMealPlanItemsTable } from "@workspace/db";
import { eq, desc, asc, and } from "drizzle-orm";
import {
  CreateLibraryMealPlanBody,
  UpdateLibraryMealPlanBody,
  AddLibraryMealPlanItemBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getOwnedPlan(planId: number, doctorId: number) {
  const [plan] = await db
    .select()
    .from(libraryMealPlansTable)
    .where(and(eq(libraryMealPlansTable.id, planId), eq(libraryMealPlansTable.doctorId, doctorId)))
    .limit(1);
  return plan ?? null;
}

router.get("/", async (req, res) => {
  const doctorId = req.session.doctorId!;
  try {
    const plans = await db
      .select()
      .from(libraryMealPlansTable)
      .where(eq(libraryMealPlansTable.doctorId, doctorId))
      .orderBy(desc(libraryMealPlansTable.createdAt));
    res.json(plans);
  } catch (err) {
    req.log.error({ err }, "Get library meal plans error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const doctorId = req.session.doctorId!;
  try {
    const body = { ...req.body };
    if (body.targetPhase === null) delete body.targetPhase;
    const parsed = CreateLibraryMealPlanBody.safeParse(body);
    if (!parsed.success) {
      res.status(400).json({ error: "INVALID_INPUT", message: parsed.error.message });
      return;
    }
    const [plan] = await db
      .insert(libraryMealPlansTable)
      .values({
        doctorId,
        name: parsed.data.name,
        description: parsed.data.description ?? "",
        targetPhase: parsed.data.targetPhase ?? null,
      })
      .returning();
    res.status(201).json(plan);
  } catch (err) {
    req.log.error({ err }, "Create library meal plan error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.get("/library", async (req, res) => {
  const doctorId = req.session.doctorId!;
  try {
    const plans = await db
      .select()
      .from(libraryMealPlansTable)
      .where(eq(libraryMealPlansTable.doctorId, doctorId))
      .orderBy(desc(libraryMealPlansTable.createdAt));
    res.json(plans);
  } catch (err) {
    req.log.error({ err }, "Get library meal plans error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.get("/:planId", async (req, res) => {
  const doctorId = req.session.doctorId!;
  try {
    const planId = parseInt(req.params.planId, 10);
    const plan = await getOwnedPlan(planId, doctorId);
    if (!plan) {
      res.status(404).json({ error: "NOT_FOUND", message: "Meal plan not found" });
      return;
    }
    const items = await db
      .select()
      .from(libraryMealPlanItemsTable)
      .where(eq(libraryMealPlanItemsTable.planId, planId))
      .orderBy(asc(libraryMealPlanItemsTable.mealType));
    res.json({ ...plan, items });
  } catch (err) {
    req.log.error({ err }, "Get library meal plan error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.put("/:planId", async (req, res) => {
  const doctorId = req.session.doctorId!;
  try {
    const planId = parseInt(req.params.planId, 10);
    const existing = await getOwnedPlan(planId, doctorId);
    if (!existing) {
      res.status(404).json({ error: "NOT_FOUND", message: "Meal plan not found" });
      return;
    }
    const body = { ...req.body };
    if (body.targetPhase === null) delete body.targetPhase;
    const parsed = UpdateLibraryMealPlanBody.safeParse(body);
    if (!parsed.success) {
      res.status(400).json({ error: "INVALID_INPUT", message: parsed.error.message });
      return;
    }
    const updateData: Partial<typeof libraryMealPlansTable.$inferInsert> = {
      ...parsed.data,
      updatedAt: new Date(),
    };
    if (req.body.targetPhase === null) updateData.targetPhase = null;
    const [updated] = await db
      .update(libraryMealPlansTable)
      .set(updateData)
      .where(and(eq(libraryMealPlansTable.id, planId), eq(libraryMealPlansTable.doctorId, doctorId)))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Update library meal plan error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.delete("/:planId", async (req, res) => {
  const doctorId = req.session.doctorId!;
  try {
    const planId = parseInt(req.params.planId, 10);
    const existing = await getOwnedPlan(planId, doctorId);
    if (!existing) {
      res.status(404).json({ error: "NOT_FOUND", message: "Meal plan not found" });
      return;
    }
    await db.delete(libraryMealPlanItemsTable).where(eq(libraryMealPlanItemsTable.planId, planId));
    await db.delete(libraryMealPlansTable).where(eq(libraryMealPlansTable.id, planId));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Delete library meal plan error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.post("/:planId/items", async (req, res) => {
  const doctorId = req.session.doctorId!;
  try {
    const planId = parseInt(req.params.planId, 10);
    const plan = await getOwnedPlan(planId, doctorId);
    if (!plan) {
      res.status(404).json({ error: "NOT_FOUND", message: "Meal plan not found" });
      return;
    }
    const parsed = AddLibraryMealPlanItemBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "INVALID_INPUT", message: parsed.error.message });
      return;
    }
    const [item] = await db
      .insert(libraryMealPlanItemsTable)
      .values({
        planId,
        mealType: parsed.data.mealType as "breakfast" | "lunch" | "dinner" | "snack",
        foodName: parsed.data.foodName,
        portionGrams: parsed.data.portionGrams,
        unit: parsed.data.unit ?? "g",
        calories: parsed.data.calories ?? 0,
        carbs: parsed.data.carbs ?? 0,
        fat: parsed.data.fat ?? 0,
        protein: parsed.data.protein ?? 0,
        notes: parsed.data.notes ?? "",
      })
      .returning();
    res.status(201).json(item);
  } catch (err) {
    req.log.error({ err }, "Add library meal plan item error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.delete("/:planId/items/:itemId", async (req, res) => {
  const doctorId = req.session.doctorId!;
  try {
    const planId = parseInt(req.params.planId, 10);
    const itemId = parseInt(req.params.itemId, 10);
    const plan = await getOwnedPlan(planId, doctorId);
    if (!plan) {
      res.status(404).json({ error: "NOT_FOUND", message: "Meal plan not found" });
      return;
    }
    await db
      .delete(libraryMealPlanItemsTable)
      .where(and(eq(libraryMealPlanItemsTable.id, itemId), eq(libraryMealPlanItemsTable.planId, planId)));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Delete library meal plan item error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;

import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { libraryMealPlansTable, libraryMealPlanItemsTable } from "@workspace/db";
import { eq, desc, asc, and } from "drizzle-orm";
import {
  CreateLibraryMealPlanBody,
  UpdateLibraryMealPlanBody,
  AddLibraryMealPlanItemBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

/** Resolve the authenticated doctor ID from the request session.
 *  Returns undefined and sends a 401 response when no session is present. */
function requireDoctorId(req: Request, res: Response): number | undefined {
  const doctorId = req.session?.doctorId;
  if (!doctorId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required" });
    return undefined;
  }
  return doctorId;
}

/** Look up a library plan that belongs to the given doctor.
 *  Returns null if not found or if the plan is not explicitly owned by doctorId (strict equality). */
async function getOwnedPlan(planId: number, doctorId: number) {
  const [plan] = await db
    .select()
    .from(libraryMealPlansTable)
    .where(eq(libraryMealPlansTable.id, planId))
    .limit(1);

  if (!plan) return null;
  // Strict ownership: plan must be explicitly owned by the calling doctor
  if (plan.doctorId !== doctorId) return null;
  return plan;
}

// GET /meal-plans — list all plans owned by the current doctor
router.get("/", async (req, res) => {
  try {
    const doctorId = requireDoctorId(req, res);
    if (!doctorId) return;

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

// POST /meal-plans — create a library plan owned by the current doctor
router.post("/", async (req, res) => {
  try {
    const doctorId = requireDoctorId(req, res);
    if (!doctorId) return;

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

// GET /meal-plans/:planId — get plan detail (must be owned by calling doctor)
router.get("/:planId", async (req, res) => {
  try {
    const doctorId = requireDoctorId(req, res);
    if (!doctorId) return;

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

// PUT /meal-plans/:planId — update plan (must be owned by calling doctor)
router.put("/:planId", async (req, res) => {
  try {
    const doctorId = requireDoctorId(req, res);
    if (!doctorId) return;

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
      .where(eq(libraryMealPlansTable.id, planId))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Update library meal plan error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

// DELETE /meal-plans/:planId — delete plan (must be owned by calling doctor)
// CASCADE: onDelete: "set null" on kids.currentMealPlanId handles unassignment automatically
router.delete("/:planId", async (req, res) => {
  try {
    const doctorId = requireDoctorId(req, res);
    if (!doctorId) return;

    const planId = parseInt(req.params.planId, 10);
    const existing = await getOwnedPlan(planId, doctorId);
    if (!existing) {
      res.status(404).json({ error: "NOT_FOUND", message: "Meal plan not found" });
      return;
    }
    await db.delete(libraryMealPlanItemsTable).where(eq(libraryMealPlanItemsTable.planId, planId));
    await db.delete(libraryMealPlansTable).where(eq(libraryMealPlansTable.id, planId));
    res.json({ success: true, message: "Meal plan deleted" });
  } catch (err) {
    req.log.error({ err }, "Delete library meal plan error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

// POST /meal-plans/:planId/items — add a food item (plan must be owned by calling doctor)
router.post("/:planId/items", async (req, res) => {
  try {
    const doctorId = requireDoctorId(req, res);
    if (!doctorId) return;

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

// DELETE /meal-plans/:planId/items/:itemId — remove item (plan must be owned by calling doctor)
router.delete("/:planId/items/:itemId", async (req, res) => {
  try {
    const doctorId = requireDoctorId(req, res);
    if (!doctorId) return;

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
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    req.log.error({ err }, "Delete library meal plan item error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;

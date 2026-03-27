import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { recipesTable, recipeIngredientsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

type IngredientInput = {
  foodName: string;
  portionGrams: number;
  unit?: string;
  carbs?: number;
  fat?: number;
  protein?: number;
  calories?: number;
};

function calcTotals(ingredients: typeof recipeIngredientsTable.$inferSelect[]) {
  return ingredients.reduce(
    (acc, ing) => ({
      totalCarbs: acc.totalCarbs + (ing.carbs ?? 0),
      totalFat: acc.totalFat + (ing.fat ?? 0),
      totalProtein: acc.totalProtein + (ing.protein ?? 0),
      totalCalories: acc.totalCalories + (ing.calories ?? 0),
    }),
    { totalCarbs: 0, totalFat: 0, totalProtein: 0, totalCalories: 0 }
  );
}

router.get("/", async (req, res) => {
  const doctorId = req.session.doctorId!;
  try {
    const recipes = await db
      .select()
      .from(recipesTable)
      .where(eq(recipesTable.doctorId, doctorId));

    const result = await Promise.all(
      recipes.map(async (r) => {
        const ingredients = await db
          .select()
          .from(recipeIngredientsTable)
          .where(eq(recipeIngredientsTable.recipeId, r.id));
        const totals = calcTotals(ingredients);
        return { ...r, ingredients, ...totals };
      })
    );

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "List recipes error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const doctorId = req.session.doctorId!;
  const { name, description, category, ingredients } = req.body as {
    name: string;
    description?: string;
    category?: string;
    ingredients?: IngredientInput[];
  };

  if (!name?.trim()) {
    res.status(400).json({ error: "BAD_REQUEST", message: "Recipe name is required" });
    return;
  }

  try {
    const [recipe] = await db
      .insert(recipesTable)
      .values({
        doctorId,
        name: name.trim(),
        description: description ?? "",
        category: category ?? "General",
      })
      .returning();

    const insertedIngredients: typeof recipeIngredientsTable.$inferSelect[] = [];
    if (ingredients && ingredients.length > 0) {
      for (const ing of ingredients) {
        if (!ing.foodName?.trim()) continue;
        const [inserted] = await db
          .insert(recipeIngredientsTable)
          .values({
            recipeId: recipe.id,
            foodName: ing.foodName.trim(),
            portionGrams: ing.portionGrams ?? 100,
            unit: ing.unit ?? "g",
            carbs: ing.carbs ?? 0,
            fat: ing.fat ?? 0,
            protein: ing.protein ?? 0,
            calories: ing.calories ?? 0,
          })
          .returning();
        insertedIngredients.push(inserted);
      }
    }

    const totals = calcTotals(insertedIngredients);
    res.status(201).json({ ...recipe, ingredients: insertedIngredients, ...totals });
  } catch (err) {
    req.log.error({ err }, "Create recipe error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.get("/:recipeId", async (req, res) => {
  const doctorId = req.session.doctorId!;
  const recipeId = parseInt(req.params.recipeId);

  if (isNaN(recipeId)) {
    res.status(400).json({ error: "BAD_REQUEST", message: "Invalid recipe ID" });
    return;
  }

  try {
    const [recipe] = await db
      .select()
      .from(recipesTable)
      .where(and(eq(recipesTable.id, recipeId), eq(recipesTable.doctorId, doctorId)));

    if (!recipe) {
      res.status(404).json({ error: "NOT_FOUND", message: "Recipe not found" });
      return;
    }

    const ingredients = await db
      .select()
      .from(recipeIngredientsTable)
      .where(eq(recipeIngredientsTable.recipeId, recipeId));

    const totals = calcTotals(ingredients);
    res.json({ ...recipe, ingredients, ...totals });
  } catch (err) {
    req.log.error({ err }, "Get recipe error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.put("/:recipeId", async (req, res) => {
  const doctorId = req.session.doctorId!;
  const recipeId = parseInt(req.params.recipeId);

  if (isNaN(recipeId)) {
    res.status(400).json({ error: "BAD_REQUEST", message: "Invalid recipe ID" });
    return;
  }

  const { name, description, category, ingredients } = req.body as {
    name?: string;
    description?: string;
    category?: string;
    ingredients?: IngredientInput[];
  };

  try {
    const [existing] = await db
      .select()
      .from(recipesTable)
      .where(and(eq(recipesTable.id, recipeId), eq(recipesTable.doctorId, doctorId)));

    if (!existing) {
      res.status(404).json({ error: "NOT_FOUND", message: "Recipe not found" });
      return;
    }

    const [updated] = await db
      .update(recipesTable)
      .set({
        ...(name ? { name: name.trim() } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(category ? { category } : {}),
        updatedAt: new Date(),
      })
      .where(eq(recipesTable.id, recipeId))
      .returning();

    if (ingredients !== undefined) {
      await db.delete(recipeIngredientsTable).where(eq(recipeIngredientsTable.recipeId, recipeId));
      for (const ing of ingredients) {
        if (!ing.foodName?.trim()) continue;
        await db.insert(recipeIngredientsTable).values({
          recipeId,
          foodName: ing.foodName.trim(),
          portionGrams: ing.portionGrams ?? 100,
          unit: ing.unit ?? "g",
          carbs: ing.carbs ?? 0,
          fat: ing.fat ?? 0,
          protein: ing.protein ?? 0,
          calories: ing.calories ?? 0,
        });
      }
    }

    const freshIngredients = await db
      .select()
      .from(recipeIngredientsTable)
      .where(eq(recipeIngredientsTable.recipeId, recipeId));

    const totals = calcTotals(freshIngredients);
    res.json({ ...updated, ingredients: freshIngredients, ...totals });
  } catch (err) {
    req.log.error({ err }, "Update recipe error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.delete("/:recipeId", async (req, res) => {
  const doctorId = req.session.doctorId!;
  const recipeId = parseInt(req.params.recipeId);

  if (isNaN(recipeId)) {
    res.status(400).json({ error: "BAD_REQUEST", message: "Invalid recipe ID" });
    return;
  }

  try {
    const [existing] = await db
      .select()
      .from(recipesTable)
      .where(and(eq(recipesTable.id, recipeId), eq(recipesTable.doctorId, doctorId)));

    if (!existing) {
      res.status(404).json({ error: "NOT_FOUND", message: "Recipe not found" });
      return;
    }

    await db.delete(recipeIngredientsTable).where(eq(recipeIngredientsTable.recipeId, recipeId));
    await db.delete(recipesTable).where(eq(recipesTable.id, recipeId));
    res.json({ success: true, message: "Recipe deleted" });
  } catch (err) {
    req.log.error({ err }, "Delete recipe error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.post("/:recipeId/ingredients", async (req, res) => {
  const doctorId = req.session.doctorId!;
  const recipeId = parseInt(req.params.recipeId);

  if (isNaN(recipeId)) {
    res.status(400).json({ error: "BAD_REQUEST", message: "Invalid recipe ID" });
    return;
  }

  const { foodName, portionGrams, unit, carbs, fat, protein, calories } = req.body as IngredientInput;

  if (!foodName?.trim()) {
    res.status(400).json({ error: "BAD_REQUEST", message: "foodName is required" });
    return;
  }

  try {
    const [recipe] = await db
      .select()
      .from(recipesTable)
      .where(and(eq(recipesTable.id, recipeId), eq(recipesTable.doctorId, doctorId)));

    if (!recipe) {
      res.status(404).json({ error: "NOT_FOUND", message: "Recipe not found" });
      return;
    }

    const [ingredient] = await db
      .insert(recipeIngredientsTable)
      .values({
        recipeId,
        foodName: foodName.trim(),
        portionGrams: portionGrams ?? 100,
        unit: unit ?? "g",
        carbs: carbs ?? 0,
        fat: fat ?? 0,
        protein: protein ?? 0,
        calories: calories ?? 0,
      })
      .returning();

    res.status(201).json(ingredient);
  } catch (err) {
    req.log.error({ err }, "Add ingredient error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.delete("/:recipeId/ingredients/:ingId", async (req, res) => {
  const doctorId = req.session.doctorId!;
  const recipeId = parseInt(req.params.recipeId);
  const ingId = parseInt(req.params.ingId);

  if (isNaN(recipeId) || isNaN(ingId)) {
    res.status(400).json({ error: "BAD_REQUEST", message: "Invalid ID" });
    return;
  }

  try {
    const [recipe] = await db
      .select()
      .from(recipesTable)
      .where(and(eq(recipesTable.id, recipeId), eq(recipesTable.doctorId, doctorId)));

    if (!recipe) {
      res.status(404).json({ error: "NOT_FOUND", message: "Recipe not found" });
      return;
    }

    await db.delete(recipeIngredientsTable).where(
      and(eq(recipeIngredientsTable.id, ingId), eq(recipeIngredientsTable.recipeId, recipeId))
    );

    res.json({ success: true, message: "Ingredient removed" });
  } catch (err) {
    req.log.error({ err }, "Remove ingredient error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;

import app from "./app";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import {
  doctorsTable,
  kidsTable,
  medicalSettingsTable,
  weightRecordsTable,
  mealDaysTable,
  notesTable,
  foodsTable,
  mealEntriesTable,
} from "@workspace/db";
import { count, eq } from "drizzle-orm";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function seedDefaultData() {
  try {
    const [{ value: doctorCount }] = await db
      .select({ value: count() })
      .from(doctorsTable);

    if (Number(doctorCount) > 0) {
      logger.info("Database already has data, skipping seed");
      return;
    }

    logger.info("Seeding default data...");

    // Create default doctors
    const [doctor1] = await db.insert(doctorsTable).values({
      username: "doctor",
      password: "doctor123",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@hospital.com",
      specialty: "Pediatric Neurology",
    }).returning();

    const [doctor2] = await db.insert(doctorsTable).values({
      username: "admin",
      password: "1234",
      name: "Admin Doctor",
      email: "admin@hospital.com",
      specialty: "General Medicine",
    }).returning();

    logger.info({ doctorId: doctor1.id }, "Created default doctor accounts");

    // Seed sample kids
    const kidsData = [
      { name: "Emma Thompson", dateOfBirth: "2019-03-15", gender: "female", parentName: "Mary Thompson", parentContact: "+1-555-0101", phase: 2 },
      { name: "Liam Carter", dateOfBirth: "2018-07-22", gender: "male", parentName: "John Carter", parentContact: "+1-555-0102", phase: 1 },
      { name: "Olivia Martinez", dateOfBirth: "2020-01-10", gender: "female", parentName: "Rosa Martinez", parentContact: "+1-555-0103", phase: 3 },
      { name: "Noah Williams", dateOfBirth: "2017-11-05", gender: "male", parentName: "James Williams", parentContact: "+1-555-0104", phase: 4 },
      { name: "Ava Brown", dateOfBirth: "2019-09-28", gender: "female", parentName: "Lisa Brown", parentContact: "+1-555-0105", phase: 2 },
      { name: "Ethan Davis", dateOfBirth: "2018-04-17", gender: "male", parentName: "Robert Davis", parentContact: "+1-555-0106", phase: 1 },
      { name: "Sophia Wilson", dateOfBirth: "2020-06-03", gender: "female", parentName: "Jennifer Wilson", parentContact: "+1-555-0107", phase: 2 },
      { name: "Mason Miller", dateOfBirth: "2016-12-19", gender: "male", parentName: "David Miller", parentContact: "+1-555-0108", phase: 3 },
    ];

    const medicalDefaults = [
      { phase: 2, ketoRatio: 3, dailyCalories: 1200, dailyCarbs: 20, dailyFat: 100, dailyProtein: 40 },
      { phase: 1, ketoRatio: 2, dailyCalories: 1000, dailyCarbs: 25, dailyFat: 85, dailyProtein: 35 },
      { phase: 3, ketoRatio: 4, dailyCalories: 1400, dailyCarbs: 15, dailyFat: 120, dailyProtein: 45 },
      { phase: 4, ketoRatio: 4, dailyCalories: 1600, dailyCarbs: 20, dailyFat: 135, dailyProtein: 50 },
      { phase: 2, ketoRatio: 3, dailyCalories: 1100, dailyCarbs: 20, dailyFat: 95, dailyProtein: 38 },
      { phase: 1, ketoRatio: 2, dailyCalories: 950, dailyCarbs: 25, dailyFat: 80, dailyProtein: 33 },
      { phase: 2, ketoRatio: 3, dailyCalories: 1050, dailyCarbs: 18, dailyFat: 90, dailyProtein: 36 },
      { phase: 3, ketoRatio: 4, dailyCalories: 1500, dailyCarbs: 15, dailyFat: 130, dailyProtein: 48 },
    ];

    const completionRates = [0.9, 0.4, 0.85, 0.95, 0.3, 0.7, 0.88, 0.6];

    for (let i = 0; i < kidsData.length; i++) {
      const kidData = kidsData[i];
      const codeChars = Math.random().toString(36).substring(2, 8).toUpperCase();
      const [kid] = await db.insert(kidsTable).values({
        ...kidData,
        kidCode: `KID-${codeChars}`,
        doctorId: doctor1.id,
      }).returning();

      const med = medicalDefaults[i] || medicalDefaults[0];
      await db.insert(medicalSettingsTable).values({
        kidId: kid.id,
        ...med,
        showAllFoods: true,
        showAllRecipes: true,
      });

      // Weight records (6 records over 10 weeks)
      const baseWeight = 12 + i * 1.5;
      for (let w = 0; w < 6; w++) {
        const d = new Date();
        d.setDate(d.getDate() - (5 - w) * 14);
        await db.insert(weightRecordsTable).values({
          kidId: kid.id,
          weight: Math.round((baseWeight + w * 0.3) * 10) / 10,
          date: d.toISOString().split("T")[0],
          note: w === 5 ? "Latest measurement" : null,
        });
      }

      // Meal day records (30 days)
      const rate = completionRates[i] ?? 0.7;
      for (let d = 30; d >= 0; d--) {
        const date = new Date();
        date.setDate(date.getDate() - d);
        const totalMeals = 5;
        const completedMeals = Math.round(totalMeals * rate);
        const missedMeals = totalMeals - completedMeals;
        await db.insert(mealDaysTable).values({
          kidId: kid.id,
          date: date.toISOString().split("T")[0],
          totalMeals,
          completedMeals,
          missedMeals,
          isFilled: d < 25,
          totalCalories: completedMeals * 240,
          totalCarbs: completedMeals * 4,
          totalFat: completedMeals * 20,
          totalProtein: completedMeals * 8,
        });
      }

      // Notes for first 3 kids
      if (i < 3) {
        await db.insert(notesTable).values({
          kidId: kid.id,
          doctorId: doctor1.id,
          doctorName: doctor1.name,
          content: "Please ensure the child maintains the keto ratio as prescribed. Monitor weight weekly.",
        });
      }
    }

    logger.info("Default data seeded successfully");

    // Seed sample foods
    await db.insert(foodsTable).values([
      { name: "Broccoli", category: "Vegetables", carbs: 6.6, fat: 0.4, protein: 2.8, calories: 34, description: "Green vegetable rich in fiber and vitamins", indicator: "vegi" },
      { name: "Avocado", category: "Fruits", carbs: 8.5, fat: 15, protein: 2, calories: 160, description: "High fat fruit ideal for keto diet", indicator: "fruit" },
      { name: "Chicken Breast", category: "Meat", carbs: 0, fat: 3.6, protein: 31, calories: 165, description: "Lean protein source", indicator: "non-vegi" },
      { name: "Salmon", category: "Fish", carbs: 0, fat: 13, protein: 25, calories: 208, description: "Rich in omega-3 fatty acids", indicator: "non-vegi" },
      { name: "Almonds", category: "Nuts", carbs: 6, fat: 49, protein: 21, calories: 576, description: "High fat, low carb nuts", indicator: "vegi" },
      { name: "Eggs", category: "Dairy", carbs: 1.1, fat: 10, protein: 12, calories: 155, description: "Complete protein source", indicator: "non-vegi" },
      { name: "Spinach", category: "Vegetables", carbs: 3.6, fat: 0.4, protein: 2.9, calories: 23, description: "Nutrient-dense leafy green", indicator: "vegi" },
      { name: "Butter", category: "Dairy", carbs: 0, fat: 81, protein: 1, calories: 717, description: "High fat dairy for keto cooking", indicator: "non-vegi" },
      { name: "Cream Cheese", category: "Dairy", carbs: 4, fat: 34, protein: 6, calories: 342, description: "Creamy high-fat cheese", indicator: "non-vegi" },
      { name: "Blueberries", category: "Fruits", carbs: 14, fat: 0.3, protein: 0.7, calories: 57, description: "Antioxidant-rich berries (in moderation)", indicator: "fruit" },
      { name: "Olive Oil", category: "Oils", carbs: 0, fat: 100, protein: 0, calories: 884, description: "Heart-healthy fat for cooking", indicator: "vegi" },
      { name: "Cheddar Cheese", category: "Dairy", carbs: 1.3, fat: 33, protein: 25, calories: 403, description: "Rich flavored cheese high in fat", indicator: "non-vegi" },
      { name: "Ground Beef", category: "Meat", carbs: 0, fat: 20, protein: 26, calories: 287, description: "Versatile keto protein source", indicator: "non-vegi" },
      { name: "Cauliflower", category: "Vegetables", carbs: 5, fat: 0.3, protein: 1.9, calories: 25, description: "Low-carb rice/flour substitute", indicator: "vegi" },
      { name: "Bacon", category: "Meat", carbs: 0.6, fat: 42, protein: 37, calories: 541, description: "High fat meat popular in keto", indicator: "non-vegi" },
    ]);
    logger.info("Foods seeded successfully");
  } catch (err) {
    logger.error({ err }, "Failed to seed default data");
  }
}

async function seedMealEntries() {
  try {
    const kids = await db.select({ id: kidsTable.id }).from(kidsTable);
    if (kids.length === 0) return;

    const mealsTemplate = [
      { mealType: "breakfast", foods: [
        { foodName: "Scrambled Eggs", quantity: 2, unit: "pcs", calories: 155, carbs: 1.1, fat: 10, protein: 12 },
        { foodName: "Butter", quantity: 10, unit: "g", calories: 72, carbs: 0, fat: 8.1, protein: 0.1 },
        { foodName: "Bacon", quantity: 30, unit: "g", calories: 162, carbs: 0.2, fat: 12.6, protein: 11 },
      ]},
      { mealType: "lunch", foods: [
        { foodName: "Chicken Breast", quantity: 100, unit: "g", calories: 165, carbs: 0, fat: 3.6, protein: 31 },
        { foodName: "Avocado", quantity: 80, unit: "g", calories: 128, carbs: 6.8, fat: 12, protein: 1.6 },
        { foodName: "Spinach", quantity: 50, unit: "g", calories: 12, carbs: 1.8, fat: 0.2, protein: 1.5 },
      ]},
      { mealType: "dinner", foods: [
        { foodName: "Salmon", quantity: 120, unit: "g", calories: 250, carbs: 0, fat: 15.6, protein: 30 },
        { foodName: "Broccoli", quantity: 100, unit: "g", calories: 34, carbs: 6.6, fat: 0.4, protein: 2.8 },
        { foodName: "Olive Oil", quantity: 15, unit: "ml", calories: 133, carbs: 0, fat: 15, protein: 0 },
      ]},
      { mealType: "snack", foods: [
        { foodName: "Almonds", quantity: 30, unit: "g", calories: 173, carbs: 1.8, fat: 14.7, protein: 6.3 },
        { foodName: "Cream Cheese", quantity: 20, unit: "g", calories: 68, carbs: 0.8, fat: 6.8, protein: 1.2 },
      ]},
    ];

    let seeded = 0;
    for (const kid of kids) {
      const [{ value: kidEntryCount }] = await db
        .select({ value: count() })
        .from(mealEntriesTable)
        .where(eq(mealEntriesTable.kidId, kid.id));
      if (Number(kidEntryCount) > 0) continue;

      for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        const dateStr = d.toISOString().split("T")[0];
        for (const meal of mealsTemplate) {
          for (const food of meal.foods) {
            await db.insert(mealEntriesTable).values({
              kidId: kid.id,
              date: dateStr,
              mealType: meal.mealType,
              ...food,
            });
          }
        }
      }
      seeded++;
    }
    if (seeded > 0) logger.info({ seeded }, "Meal entries seeded successfully");
  } catch (err) {
    logger.error({ err }, "Failed to seed meal entries");
  }
}

async function main() {
  await seedDefaultData();
  await seedMealEntries();

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
}

main().catch((err) => {
  logger.error({ err }, "Fatal startup error");
  process.exit(1);
});

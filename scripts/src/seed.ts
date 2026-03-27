import { db } from "@workspace/db";
import {
  doctorsTable,
  kidsTable,
  medicalSettingsTable,
  weightRecordsTable,
  mealDaysTable,
  mealLogsTable,
  notesTable,
  foodsTable,
  libraryMealPlansTable,
  libraryMealPlanItemsTable,
  mealPlansTable,
  mealPlanItemsTable,
  mealEntriesTable,
  ketoneReadingsTable,
  kidFoodApprovalsTable,
} from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // ── 1. Migrate legacy "doctor" username → "admin" (one-time rename) ─────────
  const legacyDoctors = await db.select().from(doctorsTable).where(eq(doctorsTable.username, "doctor"));
  if (legacyDoctors.length > 0) {
    await db.update(doctorsTable)
      .set({ username: "admin" })
      .where(eq(doctorsTable.username, "doctor"));
    console.log("Migrated legacy 'doctor' account → username='admin'");
  }

  // ── 2. Upsert admin account with bcrypt password ───────────────────────────
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const existingAdmins = await db.select().from(doctorsTable).where(eq(doctorsTable.username, "admin"));
  let doctorId: number;

  if (existingAdmins.length > 0) {
    await db.update(doctorsTable)
      .set({ password: hashedPassword, role: "admin" })
      .where(eq(doctorsTable.username, "admin"));
    doctorId = existingAdmins[0].id;
    console.log("Admin account updated (password + role):", doctorId);
  } else {
    const [doctor] = await db
      .insert(doctorsTable)
      .values({
        username: "admin",
        password: hashedPassword,
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@ketokidcare.com",
        specialty: "Pediatric Neurology",
        role: "admin",
      })
      .returning();
    doctorId = doctor.id;
    console.log("Admin account created:", doctorId);
  }

  // ── 2b. Upsert moderator account ─────────────────────────────────────────
  const moderatorPassword = await bcrypt.hash("admin1234", 12);
  const existingMods = await db.select().from(doctorsTable).where(eq(doctorsTable.username, "admin1"));

  if (existingMods.length > 0) {
    await db.update(doctorsTable)
      .set({ password: moderatorPassword, role: "moderator" })
      .where(eq(doctorsTable.username, "admin1"));
    console.log("Moderator account updated:", existingMods[0].id);
  } else {
    const [mod] = await db
      .insert(doctorsTable)
      .values({
        username: "admin1",
        password: moderatorPassword,
        name: "Dr. Alex Moderator",
        email: "alex.moderator@ketokidcare.com",
        specialty: "Pediatric Neurology",
        role: "moderator",
      })
      .returning();
    console.log("Moderator account created:", mod.id);
  }

  // ── 3. Seed 60 keto-appropriate foods (canonical categories) ──────────────
  const existingFoodCount = await db.select().from(foodsTable);
  if (existingFoodCount.length < 62) {
    const foods = [
      // Vegetables
      { name: "Avocado",               category: "Vegetables", carbs: 2,    fat: 15,   protein: 2,    calories: 160, indicator: "vegi",    description: "High in healthy fats, great for keto" },
      { name: "Broccoli",              category: "Vegetables", carbs: 4,    fat: 0.4,  protein: 2.6,  calories: 34,  indicator: "vegi",    description: "Low-carb cruciferous vegetable" },
      { name: "Spinach",               category: "Vegetables", carbs: 1.4,  fat: 0.4,  protein: 2.9,  calories: 23,  indicator: "vegi",    description: "Leafy green rich in iron and magnesium" },
      { name: "Cauliflower",           category: "Vegetables", carbs: 5,    fat: 0.3,  protein: 1.9,  calories: 25,  indicator: "vegi",    description: "Versatile low-carb vegetable" },
      { name: "Zucchini",              category: "Vegetables", carbs: 3.1,  fat: 0.3,  protein: 1.2,  calories: 17,  indicator: "vegi",    description: "Light squash suitable for keto diets" },
      { name: "Cucumber",              category: "Vegetables", carbs: 3.6,  fat: 0.1,  protein: 0.7,  calories: 15,  indicator: "vegi",    description: "Refreshing, very low carb" },
      { name: "Cabbage",               category: "Vegetables", carbs: 5.8,  fat: 0.1,  protein: 1.3,  calories: 25,  indicator: "vegi",    description: "Affordable keto-friendly vegetable" },
      { name: "Bell Pepper",           category: "Vegetables", carbs: 4.6,  fat: 0.3,  protein: 0.9,  calories: 20,  indicator: "vegi",    description: "Green peppers lower in carbs" },
      { name: "Kale",                  category: "Vegetables", carbs: 4.4,  fat: 0.9,  protein: 4.3,  calories: 49,  indicator: "vegi",    description: "Nutrient-dense leafy green" },
      { name: "Asparagus",             category: "Vegetables", carbs: 3.9,  fat: 0.1,  protein: 2.2,  calories: 20,  indicator: "vegi",    description: "Low-carb spring vegetable" },
      { name: "Celery",                category: "Vegetables", carbs: 3,    fat: 0.2,  protein: 0.7,  calories: 16,  indicator: "vegi",    description: "Very low calorie, keto staple" },
      { name: "Mushrooms",             category: "Vegetables", carbs: 3.3,  fat: 0.3,  protein: 3.1,  calories: 22,  indicator: "vegi",    description: "Savory and low carb" },
      { name: "Lettuce",               category: "Vegetables", carbs: 2.4,  fat: 0.3,  protein: 1.2,  calories: 17,  indicator: "vegi",    description: "Classic salad base" },
      { name: "Green Beans",           category: "Vegetables", carbs: 7,    fat: 0.1,  protein: 1.8,  calories: 31,  indicator: "vegi",    description: "Kid-friendly vegetable" },
      { name: "Eggplant",              category: "Vegetables", carbs: 5.9,  fat: 0.2,  protein: 1,    calories: 25,  indicator: "vegi",    description: "Low-carb Mediterranean vegetable" },
      // Oils
      { name: "Olive Oil",             category: "Oils",       carbs: 0,    fat: 100,  protein: 0,    calories: 884, indicator: "vegi",    description: "Primary fat source for keto cooking" },
      { name: "Coconut Oil",           category: "Oils",       carbs: 0,    fat: 100,  protein: 0,    calories: 862, indicator: "vegi",    description: "High MCT fat ideal for ketogenic diets" },
      { name: "Butter",                category: "Oils",       carbs: 0.1,  fat: 81,   protein: 0.9,  calories: 717, indicator: "vegi",    description: "Saturated fat for keto cooking" },
      { name: "Avocado Oil",           category: "Oils",       carbs: 0,    fat: 100,  protein: 0,    calories: 884, indicator: "vegi",    description: "Neutral-flavored keto cooking oil" },
      { name: "MCT Oil",               category: "Oils",       carbs: 0,    fat: 100,  protein: 0,    calories: 862, indicator: "vegi",    description: "Medium-chain triglycerides for rapid ketone production" },
      // Dairy
      { name: "Heavy Cream",           category: "Dairy",      carbs: 3.4,  fat: 35,   protein: 2.1,  calories: 340, indicator: "vegi",    description: "High-fat dairy, great for ketogenic ratios" },
      { name: "Cream Cheese",          category: "Dairy",      carbs: 4.1,  fat: 33,   protein: 5.9,  calories: 342, indicator: "vegi",    description: "Rich keto-friendly spread" },
      { name: "Cheddar Cheese",        category: "Dairy",      carbs: 1.3,  fat: 33,   protein: 25,   calories: 403, indicator: "vegi",    description: "Popular hard cheese for keto snacks" },
      { name: "Mozzarella",            category: "Dairy",      carbs: 2.2,  fat: 22,   protein: 22,   calories: 280, indicator: "vegi",    description: "Mild cheese suitable for children" },
      { name: "Parmesan",              category: "Dairy",      carbs: 3.2,  fat: 29,   protein: 38,   calories: 431, indicator: "vegi",    description: "Strong flavored, high protein cheese" },
      { name: "Greek Yogurt",          category: "Dairy",      carbs: 4.1,  fat: 5,    protein: 9,    calories: 97,  indicator: "vegi",    description: "Higher protein dairy option" },
      // Meat
      { name: "Chicken Breast",        category: "Meat",       carbs: 0,    fat: 3.6,  protein: 31,   calories: 165, indicator: "non-vegi", description: "Lean protein source for keto" },
      { name: "Chicken Thigh",         category: "Meat",       carbs: 0,    fat: 9,    protein: 26,   calories: 209, indicator: "non-vegi", description: "Juicier cut with higher fat content" },
      { name: "Ground Beef",           category: "Meat",       carbs: 0,    fat: 20,   protein: 26,   calories: 287, indicator: "non-vegi", description: "Versatile keto protein base" },
      { name: "Beef Ribeye",           category: "Meat",       carbs: 0,    fat: 37,   protein: 27,   calories: 450, indicator: "non-vegi", description: "High-fat cut for higher keto ratios" },
      { name: "Lamb Chops",            category: "Meat",       carbs: 0,    fat: 24,   protein: 25,   calories: 315, indicator: "non-vegi", description: "Rich lamb meat with good fat content" },
      { name: "Bacon",                 category: "Meat",       carbs: 0.7,  fat: 42,   protein: 37,   calories: 541, indicator: "non-vegi", description: "High-fat cured meat for keto" },
      { name: "Pork Belly",            category: "Meat",       carbs: 0,    fat: 53,   protein: 9,    calories: 518, indicator: "non-vegi", description: "Very high fat, ideal for 4:1 keto ratio" },
      { name: "Turkey Breast",         category: "Meat",       carbs: 0,    fat: 1,    protein: 29,   calories: 135, indicator: "non-vegi", description: "Very lean poultry protein" },
      { name: "Duck",                  category: "Meat",       carbs: 0,    fat: 28,   protein: 19,   calories: 337, indicator: "non-vegi", description: "High-fat poultry ideal for keto ratios" },
      // Fish
      { name: "Salmon",                category: "Fish",       carbs: 0,    fat: 13,   protein: 25,   calories: 208, indicator: "non-vegi", description: "Rich omega-3, excellent for keto" },
      { name: "Tuna",                  category: "Fish",       carbs: 0,    fat: 5,    protein: 25,   calories: 132, indicator: "non-vegi", description: "Convenient protein source" },
      { name: "Sardines",              category: "Fish",       carbs: 0,    fat: 11,   protein: 25,   calories: 208, indicator: "non-vegi", description: "High omega-3 small fish" },
      { name: "Mackerel",              category: "Fish",       carbs: 0,    fat: 13,   protein: 19,   calories: 205, indicator: "non-vegi", description: "Fatty fish high in omega-3s" },
      { name: "Shrimp",                category: "Fish",       carbs: 0.9,  fat: 1.4,  protein: 24,   calories: 106, indicator: "non-vegi", description: "Low fat seafood, high protein" },
      { name: "Cod",                   category: "Fish",       carbs: 0,    fat: 0.7,  protein: 18,   calories: 82,  indicator: "non-vegi", description: "Lean white fish, mild flavor" },
      // Eggs
      { name: "Whole Eggs",            category: "Dairy",      carbs: 0.6,  fat: 10,   protein: 13,   calories: 155, indicator: "non-vegi", description: "Complete protein, essential keto food" },
      { name: "Egg Yolks",             category: "Dairy",      carbs: 3.6,  fat: 27,   protein: 16,   calories: 322, indicator: "non-vegi", description: "Fat and nutrient dense egg component" },
      // Nuts
      { name: "Macadamia Nuts",        category: "Nuts",       carbs: 5,    fat: 76,   protein: 8,    calories: 718, indicator: "vegi",    description: "Highest fat nut, ideal for keto" },
      { name: "Walnuts",               category: "Nuts",       carbs: 7,    fat: 65,   protein: 15,   calories: 654, indicator: "vegi",    description: "Rich in omega-3 fatty acids" },
      { name: "Almonds",               category: "Nuts",       carbs: 10,   fat: 50,   protein: 21,   calories: 579, indicator: "vegi",    description: "Popular keto snack nut" },
      { name: "Pecans",                category: "Nuts",       carbs: 4,    fat: 72,   protein: 9,    calories: 691, indicator: "vegi",    description: "Very low net carb nut" },
      { name: "Chia Seeds",            category: "Nuts",       carbs: 6,    fat: 31,   protein: 17,   calories: 486, indicator: "vegi",    description: "High fiber, omega-3 seeds" },
      { name: "Flaxseeds",             category: "Nuts",       carbs: 3,    fat: 42,   protein: 18,   calories: 534, indicator: "vegi",    description: "Omega-3 rich seeds for keto baking" },
      { name: "Pumpkin Seeds",         category: "Nuts",       carbs: 3,    fat: 49,   protein: 30,   calories: 559, indicator: "vegi",    description: "High protein, magnesium-rich" },
      { name: "Hemp Seeds",            category: "Nuts",       carbs: 3,    fat: 49,   protein: 32,   calories: 553, indicator: "vegi",    description: "Complete protein with great fat ratio" },
      { name: "Almond Butter",         category: "Nuts",       carbs: 7,    fat: 50,   protein: 21,   calories: 614, indicator: "vegi",    description: "Keto-friendly nut butter" },
      // Fruit (limited, keto-appropriate)
      { name: "Blueberries",           category: "Fruit",      carbs: 12,   fat: 0.3,  protein: 0.7,  calories: 57,  indicator: "fruit",   description: "Lower sugar berries for occasional keto use" },
      { name: "Raspberries",           category: "Fruit",      carbs: 5.4,  fat: 0.7,  protein: 1.2,  calories: 52,  indicator: "fruit",   description: "Low net carb berries" },
      { name: "Strawberries",          category: "Fruit",      carbs: 7.7,  fat: 0.3,  protein: 0.7,  calories: 32,  indicator: "fruit",   description: "Moderate carb berries in small portions" },
      { name: "Blackberries",          category: "Fruit",      carbs: 5.1,  fat: 0.5,  protein: 1.4,  calories: 43,  indicator: "fruit",   description: "Low net carb berry option" },
      { name: "Olives",                category: "Fruit",      carbs: 3.8,  fat: 11,   protein: 0.8,  calories: 115, indicator: "fruit",   description: "High fat fruit ideal for keto" },
      { name: "Coconut Meat",          category: "Fruit",      carbs: 6,    fat: 35,   protein: 3.3,  calories: 354, indicator: "fruit",   description: "High-fat tropical fruit for keto" },
      // Grains (keto-friendly alternatives)
      { name: "Almond Flour",          category: "Grains",     carbs: 10,   fat: 54,   protein: 24,   calories: 576, indicator: "vegi",    description: "Low-carb flour alternative for keto baking" },
      { name: "Coconut Flour",         category: "Grains",     carbs: 18,   fat: 9,    protein: 6,    calories: 400, indicator: "vegi",    description: "High-fiber keto baking flour, very absorbent" },
      { name: "Psyllium Husk",         category: "Grains",     carbs: 2,    fat: 0,    protein: 0,    calories: 20,  indicator: "vegi",    description: "Keto-friendly binder and fiber supplement" },
      { name: "Flaxseed Meal",         category: "Grains",     carbs: 2,    fat: 9,    protein: 5,    calories: 140, indicator: "vegi",    description: "Ground flaxseeds for keto bread and baking" },
    ];

    for (const food of foods) {
      await db.insert(foodsTable).values({
        ...food,
        isActive: true,
      }).onConflictDoNothing();
    }
    console.log(`Foods seeded: ${foods.length}`);
  } else {
    console.log(`Foods already seeded (${existingFoodCount.length} found), skipping.`);
  }

  // ── 4. Seed 5 library meal plans ───────────────────────────────────────────
  const existingPlans = await db.select().from(libraryMealPlansTable).where(eq(libraryMealPlansTable.doctorId, doctorId));
  if (existingPlans.length < 5) {
    const plans = [
      {
        name: "Phase 1 Starter Plan",
        description: "Gentle introduction to the ketogenic diet with 2:1 ratio. Ideal for newly diagnosed patients.",
        targetPhase: 1,
        items: [
          { mealType: "breakfast", foodName: "Scrambled Eggs with Butter",     portionGrams: 120, unit: "g", calories: 210, carbs: 1.2, fat: 18,   protein: 12 },
          { mealType: "breakfast", foodName: "Heavy Cream",                     portionGrams: 30,  unit: "g", calories: 102, carbs: 1,   fat: 10.5, protein: 0.6 },
          { mealType: "lunch",     foodName: "Chicken Breast with Avocado",     portionGrams: 150, unit: "g", calories: 290, carbs: 3,   fat: 20,   protein: 24 },
          { mealType: "lunch",     foodName: "Broccoli with Butter",            portionGrams: 80,  unit: "g", calories: 85,  carbs: 4,   fat: 6,    protein: 2 },
          { mealType: "dinner",    foodName: "Salmon with Cream Cheese",        portionGrams: 140, unit: "g", calories: 320, carbs: 2,   fat: 25,   protein: 22 },
          { mealType: "dinner",    foodName: "Spinach Salad with Olive Oil",    portionGrams: 60,  unit: "g", calories: 70,  carbs: 1,   fat: 6,    protein: 1.5 },
          { mealType: "snack",     foodName: "Macadamia Nuts",                  portionGrams: 25,  unit: "g", calories: 180, carbs: 1.3, fat: 19,   protein: 2 },
        ],
      },
      {
        name: "Phase 2 Classic Keto",
        description: "Standard 3:1 ketogenic ratio. Balanced macros for children in stable keto therapy.",
        targetPhase: 2,
        items: [
          { mealType: "breakfast", foodName: "Eggs with Bacon and Butter",      portionGrams: 150, unit: "g", calories: 380, carbs: 1,   fat: 32,   protein: 22 },
          { mealType: "breakfast", foodName: "Avocado",                         portionGrams: 60,  unit: "g", calories: 96,  carbs: 1.2, fat: 9,    protein: 1.2 },
          { mealType: "lunch",     foodName: "Ground Beef with Cauliflower",    portionGrams: 180, unit: "g", calories: 350, carbs: 5,   fat: 28,   protein: 22 },
          { mealType: "lunch",     foodName: "Cheddar Cheese",                  portionGrams: 30,  unit: "g", calories: 121, carbs: 0.4, fat: 10,   protein: 7.5 },
          { mealType: "dinner",    foodName: "Chicken Thigh with Cream Sauce",  portionGrams: 200, unit: "g", calories: 420, carbs: 3,   fat: 34,   protein: 28 },
          { mealType: "dinner",    foodName: "Zucchini with Olive Oil",         portionGrams: 100, unit: "g", calories: 50,  carbs: 3,   fat: 3.5,  protein: 1.2 },
          { mealType: "snack",     foodName: "Walnuts and Cream Cheese",        portionGrams: 40,  unit: "g", calories: 195, carbs: 2.8, fat: 18,   protein: 5 },
        ],
      },
      {
        name: "Phase 3 High Ratio",
        description: "Strict 4:1 ketogenic ratio for seizure control. Higher fat content for maximum ketosis.",
        targetPhase: 3,
        items: [
          { mealType: "breakfast", foodName: "Egg Yolks with MCT Oil",          portionGrams: 80,  unit: "g", calories: 310, carbs: 2.9, fat: 30,   protein: 9 },
          { mealType: "breakfast", foodName: "Heavy Cream Smoothie",            portionGrams: 120, unit: "g", calories: 408, carbs: 4,   fat: 42,   protein: 2.5 },
          { mealType: "lunch",     foodName: "Pork Belly with Spinach",         portionGrams: 120, unit: "g", calories: 480, carbs: 1,   fat: 45,   protein: 16 },
          { mealType: "lunch",     foodName: "Avocado with Olive Oil",          portionGrams: 80,  unit: "g", calories: 210, carbs: 2,   fat: 20,   protein: 1.6 },
          { mealType: "dinner",    foodName: "Salmon with Butter Sauce",        portionGrams: 150, unit: "g", calories: 420, carbs: 0.5, fat: 35,   protein: 28 },
          { mealType: "dinner",    foodName: "Macadamia Nut Cream",             portionGrams: 50,  unit: "g", calories: 359, carbs: 2.5, fat: 38,   protein: 4 },
          { mealType: "snack",     foodName: "Coconut Oil Fat Bomb",            portionGrams: 30,  unit: "g", calories: 259, carbs: 0,   fat: 28,   protein: 0.5 },
        ],
      },
      {
        name: "Phase 4 Maintenance",
        description: "Modified ketogenic diet for long-term maintenance. Allows slightly higher carbs.",
        targetPhase: 4,
        items: [
          { mealType: "breakfast", foodName: "Greek Yogurt with Berries",       portionGrams: 150, unit: "g", calories: 165, carbs: 12,  fat: 8,    protein: 14 },
          { mealType: "breakfast", foodName: "Almond Butter with Eggs",         portionGrams: 100, unit: "g", calories: 280, carbs: 5,   fat: 22,   protein: 16 },
          { mealType: "lunch",     foodName: "Tuna Salad with Avocado",         portionGrams: 200, unit: "g", calories: 340, carbs: 5,   fat: 24,   protein: 26 },
          { mealType: "lunch",     foodName: "Mixed Greens with Olive Oil",     portionGrams: 80,  unit: "g", calories: 75,  carbs: 4,   fat: 6,    protein: 1.5 },
          { mealType: "dinner",    foodName: "Beef Ribeye with Vegetables",     portionGrams: 180, unit: "g", calories: 520, carbs: 8,   fat: 38,   protein: 35 },
          { mealType: "dinner",    foodName: "Broccoli with Cheddar",           portionGrams: 100, unit: "g", calories: 145, carbs: 5,   fat: 11,   protein: 7 },
          { mealType: "snack",     foodName: "Pecans and Raspberries",          portionGrams: 40,  unit: "g", calories: 200, carbs: 5,   fat: 18,   protein: 3 },
        ],
      },
      {
        name: "Anti-Seizure Intensive",
        description: "Modified Atkins approach with strict carb limits. Designed for drug-resistant epilepsy.",
        targetPhase: null,
        items: [
          { mealType: "breakfast", foodName: "Bacon and Eggs with Coconut Oil", portionGrams: 130, unit: "g", calories: 420, carbs: 0.7, fat: 38,   protein: 22 },
          { mealType: "breakfast", foodName: "Flaxseed Keto Porridge",          portionGrams: 80,  unit: "g", calories: 200, carbs: 3,   fat: 16,   protein: 8 },
          { mealType: "lunch",     foodName: "Duck with Cauliflower Mash",      portionGrams: 200, unit: "g", calories: 480, carbs: 6,   fat: 38,   protein: 28 },
          { mealType: "lunch",     foodName: "Cream Cheese with Celery",        portionGrams: 80,  unit: "g", calories: 175, carbs: 2.4, fat: 16,   protein: 4 },
          { mealType: "dinner",    foodName: "Lamb Chops with Herb Butter",     portionGrams: 180, unit: "g", calories: 530, carbs: 0,   fat: 42,   protein: 38 },
          { mealType: "dinner",    foodName: "Asparagus with Parmesan",         portionGrams: 100, unit: "g", calories: 90,  carbs: 4,   fat: 5,    protein: 6 },
          { mealType: "snack",     foodName: "Hemp Seeds with Heavy Cream",     portionGrams: 45,  unit: "g", calories: 270, carbs: 1.5, fat: 24,   protein: 10 },
        ],
      },
    ];

    for (const plan of plans) {
      const [created] = await db.insert(libraryMealPlansTable).values({
        doctorId,
        name: plan.name,
        description: plan.description,
        targetPhase: plan.targetPhase,
      }).returning();

      for (const item of plan.items) {
        await db.insert(libraryMealPlanItemsTable).values({
          planId: created.id,
          ...item,
          notes: "",
        });
      }
    }
    console.log(`Library meal plans seeded: ${plans.length}`);
  } else {
    console.log(`Library meal plans already seeded (${existingPlans.length} found), skipping.`);
  }

  // ── 5. Deterministic 15 unique kids ───────────────────────────────────────
  // Delete all existing kids owned by this doctor to ensure clean state
  const existingKids = await db.select({ id: kidsTable.id, name: kidsTable.name }).from(kidsTable).where(eq(kidsTable.doctorId, doctorId));
  if (existingKids.length > 0) {
    const existingKidIds = existingKids.map((k) => k.id);
    console.log(`Removing ${existingKidIds.length} existing kids for deterministic reseed...`);
    await db.delete(mealEntriesTable).where(inArray(mealEntriesTable.kidId, existingKidIds));
    await db.delete(ketoneReadingsTable).where(inArray(ketoneReadingsTable.kidId, existingKidIds));
    await db.delete(mealLogsTable).where(inArray(mealLogsTable.kidId, existingKidIds));
    await db.delete(kidFoodApprovalsTable).where(inArray(kidFoodApprovalsTable.kidId, existingKidIds));
    const existingMealPlans = await db.select({ id: mealPlansTable.id }).from(mealPlansTable).where(inArray(mealPlansTable.kidId, existingKidIds));
    if (existingMealPlans.length > 0) {
      await db.delete(mealPlanItemsTable).where(inArray(mealPlanItemsTable.planId, existingMealPlans.map((p) => p.id)));
      await db.delete(mealPlansTable).where(inArray(mealPlansTable.kidId, existingKidIds));
    }
    await db.delete(notesTable).where(inArray(notesTable.kidId, existingKidIds));
    await db.delete(mealDaysTable).where(inArray(mealDaysTable.kidId, existingKidIds));
    await db.delete(weightRecordsTable).where(inArray(weightRecordsTable.kidId, existingKidIds));
    await db.delete(medicalSettingsTable).where(inArray(medicalSettingsTable.kidId, existingKidIds));
    await db.delete(kidsTable).where(inArray(kidsTable.id, existingKidIds));
  }

  const kidsData = [
    { name: "Emma Thompson",    dateOfBirth: "2019-03-15", gender: "female", parentName: "Mary Thompson",   parentContact: "+1-555-0101", phase: 2 },
    { name: "Liam Carter",      dateOfBirth: "2018-07-22", gender: "male",   parentName: "John Carter",     parentContact: "+1-555-0102", phase: 1 },
    { name: "Olivia Martinez",  dateOfBirth: "2020-01-10", gender: "female", parentName: "Rosa Martinez",   parentContact: "+1-555-0103", phase: 3 },
    { name: "Noah Williams",    dateOfBirth: "2017-11-05", gender: "male",   parentName: "James Williams",  parentContact: "+1-555-0104", phase: 4 },
    { name: "Ava Brown",        dateOfBirth: "2019-09-28", gender: "female", parentName: "Lisa Brown",      parentContact: "+1-555-0105", phase: 2 },
    { name: "Ethan Davis",      dateOfBirth: "2018-04-17", gender: "male",   parentName: "Robert Davis",    parentContact: "+1-555-0106", phase: 1 },
    { name: "Sophia Wilson",    dateOfBirth: "2020-06-03", gender: "female", parentName: "Jennifer Wilson", parentContact: "+1-555-0107", phase: 2 },
    { name: "Mason Miller",     dateOfBirth: "2016-12-19", gender: "male",   parentName: "David Miller",    parentContact: "+1-555-0108", phase: 3 },
    { name: "Isabella Moore",   dateOfBirth: "2019-05-11", gender: "female", parentName: "Sarah Moore",     parentContact: "+1-555-0109", phase: 1 },
    { name: "Lucas Taylor",     dateOfBirth: "2017-08-30", gender: "male",   parentName: "Mark Taylor",     parentContact: "+1-555-0110", phase: 4 },
    { name: "Mia Anderson",     dateOfBirth: "2021-02-14", gender: "female", parentName: "Karen Anderson",  parentContact: "+1-555-0111", phase: 1 },
    { name: "Aiden Jackson",    dateOfBirth: "2018-10-07", gender: "male",   parentName: "Paul Jackson",    parentContact: "+1-555-0112", phase: 2 },
    { name: "Charlotte White",  dateOfBirth: "2020-04-22", gender: "female", parentName: "Nancy White",     parentContact: "+1-555-0113", phase: 3 },
    { name: "James Harris",     dateOfBirth: "2017-01-18", gender: "male",   parentName: "Brian Harris",    parentContact: "+1-555-0114", phase: 4 },
    { name: "Amelia Clark",     dateOfBirth: "2019-12-09", gender: "female", parentName: "Susan Clark",     parentContact: "+1-555-0115", phase: 2 },
  ];

  const completionRates = [0.9, 0.4, 0.85, 0.95, 0.3, 0.7, 0.88, 0.6, 0.75, 0.45, 0.92, 0.55, 0.82, 0.38, 0.78];
  const createdKids: { id: number; phase: number }[] = [];

  for (const kid of kidsData) {
    const [created] = await db
      .insert(kidsTable)
      .values({
        ...kid,
        kidCode: `KID-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        doctorId,
      })
      .returning();
    if (created) createdKids.push(created);
  }

  const phaseSettings: Record<number, { ketoRatio: number; dailyCalories: number; dailyCarbs: number; dailyFat: number; dailyProtein: number }> = {
    1: { ketoRatio: 2, dailyCalories: 1000, dailyCarbs: 25, dailyFat: 85,  dailyProtein: 35 },
    2: { ketoRatio: 3, dailyCalories: 1200, dailyCarbs: 20, dailyFat: 100, dailyProtein: 40 },
    3: { ketoRatio: 4, dailyCalories: 1400, dailyCarbs: 15, dailyFat: 120, dailyProtein: 45 },
    4: { ketoRatio: 4, dailyCalories: 1600, dailyCarbs: 20, dailyFat: 135, dailyProtein: 50 },
  };

  for (let i = 0; i < createdKids.length; i++) {
    const kid = createdKids[i];
    const med = phaseSettings[kid.phase] ?? phaseSettings[2];

    await db.insert(medicalSettingsTable).values({
      kidId: kid.id,
      phase: kid.phase,
      ...med,
      showAllFoods: true,
      showAllRecipes: true,
    });

    // Weight records (12 weeks of data)
    const baseWeight = 10 + i * 1.2;
    for (let w = 0; w < 12; w++) {
      const date = new Date();
      date.setDate(date.getDate() - (11 - w) * 7);
      await db.insert(weightRecordsTable).values({
        kidId: kid.id,
        weight: Math.round((baseWeight + w * 0.2 + (Math.random() - 0.5) * 0.3) * 10) / 10,
        date: date.toISOString().split("T")[0],
        note: w === 11 ? "Latest measurement" : null,
      });
    }

    // Meal days (35 days)
    const rate = completionRates[i] ?? 0.7;
    for (let d = 34; d >= 0; d--) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      const totalMeals = 5;
      const completed = Math.round(totalMeals * rate + (Math.random() - 0.5));
      const completedMeals = Math.max(0, Math.min(totalMeals, completed));
      const missedMeals = totalMeals - completedMeals;
      await db.insert(mealDaysTable).values({
        kidId: kid.id,
        date: date.toISOString().split("T")[0],
        totalMeals,
        completedMeals,
        missedMeals,
        isFilled: d < 30,
        totalCalories: completedMeals * 240,
        totalCarbs: completedMeals * 4,
        totalFat: completedMeals * 20,
        totalProtein: completedMeals * 8,
      });
    }
  }

  // Clinical notes for several kids
  const noteContents = [
    "Patient maintaining good keto compliance. Parents report no adverse effects. Continue current protocol.",
    "Weight slightly below target. Increase daily calorie target by 10%. Review in 2 weeks.",
    "Seizure frequency reduced by 60% since starting ketogenic therapy. Excellent progress.",
    "Parents struggling with meal prep. Referred to dietitian for additional support.",
    "Blood ketone levels consistently above 2.0 mmol/L. Therapy working well.",
  ];
  for (let i = 0; i < Math.min(5, createdKids.length); i++) {
    await db.insert(notesTable).values({
      kidId: createdKids[i].id,
      doctorId,
      doctorName: "Dr. Sarah Johnson",
      content: noteContents[i],
    });
  }

  console.log(`Kids seeded: ${createdKids.length} total`);
  console.log("Seeding complete!");
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});

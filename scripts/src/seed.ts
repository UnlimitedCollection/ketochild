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
  mealTypesTable,
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
  const hashedPassword = await bcrypt.hash("1234", 12);

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
        designation: "Pediatric Neurology",
        role: "admin",
      })
      .returning();
    doctorId = doctor.id;
    console.log("Admin account created:", doctorId);
  }

  // ── 2b. Upsert moderator account ─────────────────────────────────────────
  const moderatorPassword = await bcrypt.hash("12345", 12);
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
        designation: "Pediatric Neurology",
        role: "moderator",
      })
      .returning();
    console.log("Moderator account created:", mod.id);
  }

  // ── 3. Seed keto-appropriate foods with macronutrient categories ──────────
  // Categories: Carb (vegetables/fruits/grain-alternatives), Fat (fat-dense),
  //             Protein (meat/fish/eggs/cheese), Calories (pure calorie-boosting oils)
  const existingFoodCount = await db.select().from(foodsTable);
  if (existingFoodCount.length < 62) {
    const foods = [
      // Carb — low-carb vegetables
      { name: "Avocado",               category: "Fat",      carbs: 2,    fat: 15,   protein: 2,    calories: 160, indicator: "vegi",    description: "High in healthy fats, great for keto" },
      { name: "Broccoli",              category: "Carb",     carbs: 4,    fat: 0.4,  protein: 2.6,  calories: 34,  indicator: "vegi",    description: "Low-carb cruciferous vegetable" },
      { name: "Spinach",               category: "Carb",     carbs: 1.4,  fat: 0.4,  protein: 2.9,  calories: 23,  indicator: "vegi",    description: "Leafy green rich in iron and magnesium" },
      { name: "Cauliflower",           category: "Carb",     carbs: 5,    fat: 0.3,  protein: 1.9,  calories: 25,  indicator: "vegi",    description: "Versatile low-carb vegetable" },
      { name: "Zucchini",              category: "Carb",     carbs: 3.1,  fat: 0.3,  protein: 1.2,  calories: 17,  indicator: "vegi",    description: "Light squash suitable for keto diets" },
      { name: "Cucumber",              category: "Carb",     carbs: 3.6,  fat: 0.1,  protein: 0.7,  calories: 15,  indicator: "vegi",    description: "Refreshing, very low carb" },
      { name: "Cabbage",               category: "Carb",     carbs: 5.8,  fat: 0.1,  protein: 1.3,  calories: 25,  indicator: "vegi",    description: "Affordable keto-friendly vegetable" },
      { name: "Bell Pepper",           category: "Carb",     carbs: 4.6,  fat: 0.3,  protein: 0.9,  calories: 20,  indicator: "vegi",    description: "Green peppers lower in carbs" },
      { name: "Kale",                  category: "Carb",     carbs: 4.4,  fat: 0.9,  protein: 4.3,  calories: 49,  indicator: "vegi",    description: "Nutrient-dense leafy green" },
      { name: "Asparagus",             category: "Carb",     carbs: 3.9,  fat: 0.1,  protein: 2.2,  calories: 20,  indicator: "vegi",    description: "Low-carb spring vegetable" },
      { name: "Celery",                category: "Carb",     carbs: 3,    fat: 0.2,  protein: 0.7,  calories: 16,  indicator: "vegi",    description: "Very low calorie, keto staple" },
      { name: "Mushrooms",             category: "Carb",     carbs: 3.3,  fat: 0.3,  protein: 3.1,  calories: 22,  indicator: "vegi",    description: "Savory and low carb" },
      { name: "Lettuce",               category: "Carb",     carbs: 2.4,  fat: 0.3,  protein: 1.2,  calories: 17,  indicator: "vegi",    description: "Classic salad base" },
      { name: "Green Beans",           category: "Carb",     carbs: 7,    fat: 0.1,  protein: 1.8,  calories: 31,  indicator: "vegi",    description: "Kid-friendly vegetable" },
      { name: "Eggplant",              category: "Carb",     carbs: 5.9,  fat: 0.2,  protein: 1,    calories: 25,  indicator: "vegi",    description: "Low-carb Mediterranean vegetable" },
      // Calories — pure calorie-boosting oils used to hit keto fat ratios
      { name: "Olive Oil",             category: "Calories", carbs: 0,    fat: 100,  protein: 0,    calories: 884, indicator: "vegi",    description: "Primary fat source for keto cooking" },
      { name: "Coconut Oil",           category: "Calories", carbs: 0,    fat: 100,  protein: 0,    calories: 862, indicator: "vegi",    description: "High MCT fat ideal for ketogenic diets" },
      { name: "Butter",                category: "Calories", carbs: 0.1,  fat: 81,   protein: 0.9,  calories: 717, indicator: "vegi",    description: "Saturated fat for keto cooking" },
      { name: "Avocado Oil",           category: "Calories", carbs: 0,    fat: 100,  protein: 0,    calories: 884, indicator: "vegi",    description: "Neutral-flavored keto cooking oil" },
      { name: "MCT Oil",               category: "Calories", carbs: 0,    fat: 100,  protein: 0,    calories: 862, indicator: "vegi",    description: "Medium-chain triglycerides for rapid ketone production" },
      // Fat — fat-dense foods
      { name: "Heavy Cream",           category: "Fat",      carbs: 3.4,  fat: 35,   protein: 2.1,  calories: 340, indicator: "vegi",    description: "High-fat dairy, great for ketogenic ratios" },
      { name: "Cream Cheese",          category: "Fat",      carbs: 4.1,  fat: 33,   protein: 5.9,  calories: 342, indicator: "vegi",    description: "Rich keto-friendly spread" },
      // Protein — cheese & dairy
      { name: "Cheddar Cheese",        category: "Protein",  carbs: 1.3,  fat: 33,   protein: 25,   calories: 403, indicator: "vegi",    description: "Popular hard cheese for keto snacks" },
      { name: "Mozzarella",            category: "Protein",  carbs: 2.2,  fat: 22,   protein: 22,   calories: 280, indicator: "vegi",    description: "Mild cheese suitable for children" },
      { name: "Parmesan",              category: "Protein",  carbs: 3.2,  fat: 29,   protein: 38,   calories: 431, indicator: "vegi",    description: "Strong flavored, high protein cheese" },
      { name: "Greek Yogurt",          category: "Protein",  carbs: 4.1,  fat: 5,    protein: 9,    calories: 97,  indicator: "vegi",    description: "Higher protein dairy option" },
      // Protein — meats
      { name: "Chicken Breast",        category: "Protein",  carbs: 0,    fat: 3.6,  protein: 31,   calories: 165, indicator: "non-vegi", description: "Lean protein source for keto" },
      { name: "Chicken Thigh",         category: "Protein",  carbs: 0,    fat: 9,    protein: 26,   calories: 209, indicator: "non-vegi", description: "Juicier cut with higher fat content" },
      { name: "Ground Beef",           category: "Protein",  carbs: 0,    fat: 20,   protein: 26,   calories: 287, indicator: "non-vegi", description: "Versatile keto protein base" },
      { name: "Beef Ribeye",           category: "Protein",  carbs: 0,    fat: 37,   protein: 27,   calories: 450, indicator: "non-vegi", description: "High-fat cut for higher keto ratios" },
      { name: "Lamb Chops",            category: "Protein",  carbs: 0,    fat: 24,   protein: 25,   calories: 315, indicator: "non-vegi", description: "Rich lamb meat with good fat content" },
      { name: "Bacon",                 category: "Protein",  carbs: 0.7,  fat: 42,   protein: 37,   calories: 541, indicator: "non-vegi", description: "High-fat cured meat for keto" },
      { name: "Pork Belly",            category: "Fat",      carbs: 0,    fat: 53,   protein: 9,    calories: 518, indicator: "non-vegi", description: "Very high fat, ideal for 4:1 keto ratio" },
      { name: "Turkey Breast",         category: "Protein",  carbs: 0,    fat: 1,    protein: 29,   calories: 135, indicator: "non-vegi", description: "Very lean poultry protein" },
      { name: "Duck",                  category: "Protein",  carbs: 0,    fat: 28,   protein: 19,   calories: 337, indicator: "non-vegi", description: "High-fat poultry ideal for keto ratios" },
      // Protein — fish
      { name: "Salmon",                category: "Protein",  carbs: 0,    fat: 13,   protein: 25,   calories: 208, indicator: "non-vegi", description: "Rich omega-3, excellent for keto" },
      { name: "Tuna",                  category: "Protein",  carbs: 0,    fat: 5,    protein: 25,   calories: 132, indicator: "non-vegi", description: "Convenient protein source" },
      { name: "Sardines",              category: "Protein",  carbs: 0,    fat: 11,   protein: 25,   calories: 208, indicator: "non-vegi", description: "High omega-3 small fish" },
      { name: "Mackerel",              category: "Protein",  carbs: 0,    fat: 13,   protein: 19,   calories: 205, indicator: "non-vegi", description: "Fatty fish high in omega-3s" },
      { name: "Shrimp",                category: "Protein",  carbs: 0.9,  fat: 1.4,  protein: 24,   calories: 106, indicator: "non-vegi", description: "Low fat seafood, high protein" },
      { name: "Cod",                   category: "Protein",  carbs: 0,    fat: 0.7,  protein: 18,   calories: 82,  indicator: "non-vegi", description: "Lean white fish, mild flavor" },
      // Protein — eggs
      { name: "Whole Eggs",            category: "Protein",  carbs: 0.6,  fat: 10,   protein: 13,   calories: 155, indicator: "non-vegi", description: "Complete protein, essential keto food" },
      { name: "Egg Yolks",             category: "Fat",      carbs: 3.6,  fat: 27,   protein: 16,   calories: 322, indicator: "non-vegi", description: "Fat and nutrient dense egg component" },
      // Fat — nuts & seeds
      { name: "Macadamia Nuts",        category: "Fat",      carbs: 5,    fat: 76,   protein: 8,    calories: 718, indicator: "vegi",    description: "Highest fat nut, ideal for keto" },
      { name: "Walnuts",               category: "Fat",      carbs: 7,    fat: 65,   protein: 15,   calories: 654, indicator: "vegi",    description: "Rich in omega-3 fatty acids" },
      { name: "Almonds",               category: "Fat",      carbs: 10,   fat: 50,   protein: 21,   calories: 579, indicator: "vegi",    description: "Popular keto snack nut" },
      { name: "Pecans",                category: "Fat",      carbs: 4,    fat: 72,   protein: 9,    calories: 691, indicator: "vegi",    description: "Very low net carb nut" },
      { name: "Chia Seeds",            category: "Fat",      carbs: 6,    fat: 31,   protein: 17,   calories: 486, indicator: "vegi",    description: "High fiber, omega-3 seeds" },
      { name: "Flaxseeds",             category: "Fat",      carbs: 3,    fat: 42,   protein: 18,   calories: 534, indicator: "vegi",    description: "Omega-3 rich seeds for keto baking" },
      { name: "Pumpkin Seeds",         category: "Protein",  carbs: 3,    fat: 49,   protein: 30,   calories: 559, indicator: "vegi",    description: "High protein, magnesium-rich" },
      { name: "Hemp Seeds",            category: "Protein",  carbs: 3,    fat: 49,   protein: 32,   calories: 553, indicator: "vegi",    description: "Complete protein with great fat ratio" },
      { name: "Almond Butter",         category: "Fat",      carbs: 7,    fat: 50,   protein: 21,   calories: 614, indicator: "vegi",    description: "Keto-friendly nut butter" },
      // Carb — low-carb fruits
      { name: "Blueberries",           category: "Carb",     carbs: 12,   fat: 0.3,  protein: 0.7,  calories: 57,  indicator: "fruit",   description: "Lower sugar berries for occasional keto use" },
      { name: "Raspberries",           category: "Carb",     carbs: 5.4,  fat: 0.7,  protein: 1.2,  calories: 52,  indicator: "fruit",   description: "Low net carb berries" },
      { name: "Strawberries",          category: "Carb",     carbs: 7.7,  fat: 0.3,  protein: 0.7,  calories: 32,  indicator: "fruit",   description: "Moderate carb berries in small portions" },
      { name: "Blackberries",          category: "Carb",     carbs: 5.1,  fat: 0.5,  protein: 1.4,  calories: 43,  indicator: "fruit",   description: "Low net carb berry option" },
      { name: "Olives",                category: "Fat",      carbs: 3.8,  fat: 11,   protein: 0.8,  calories: 115, indicator: "fruit",   description: "High fat fruit ideal for keto" },
      { name: "Coconut Meat",          category: "Fat",      carbs: 6,    fat: 35,   protein: 3.3,  calories: 354, indicator: "fruit",   description: "High-fat tropical fruit for keto" },
      // Carb — grain alternatives
      { name: "Almond Flour",          category: "Carb",     carbs: 10,   fat: 54,   protein: 24,   calories: 576, indicator: "vegi",    description: "Low-carb flour alternative for keto baking" },
      { name: "Coconut Flour",         category: "Carb",     carbs: 18,   fat: 9,    protein: 6,    calories: 400, indicator: "vegi",    description: "High-fiber keto baking flour, very absorbent" },
      { name: "Psyllium Husk",         category: "Carb",     carbs: 2,    fat: 0,    protein: 0,    calories: 20,  indicator: "vegi",    description: "Keto-friendly binder and fiber supplement" },
      { name: "Flaxseed Meal",         category: "Carb",     carbs: 2,    fat: 9,    protein: 5,    calories: 140, indicator: "vegi",    description: "Ground flaxseeds for keto bread and baking" },
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

  // ── 3b. Seed default meal types ────────────────────────────────────────────
  const existingMealTypes = await db.select().from(mealTypesTable);
  if (existingMealTypes.length === 0) {
    const defaultMealTypes = ["Breakfast", "Lunch", "Dinner"];
    for (const name of defaultMealTypes) {
      await db.insert(mealTypesTable).values({ name }).onConflictDoNothing();
    }
    console.log(`Meal types seeded: ${defaultMealTypes.length}`);
  } else {
    console.log(`Meal types already seeded (${existingMealTypes.length} found), skipping.`);
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
          { mealType: "breakfast", foodName: "Macadamia Nuts",                  portionGrams: 25,  unit: "g", calories: 180, carbs: 1.3, fat: 19,   protein: 2 },
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
          { mealType: "breakfast", foodName: "Walnuts and Cream Cheese",        portionGrams: 40,  unit: "g", calories: 195, carbs: 2.8, fat: 18,   protein: 5 },
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
          { mealType: "breakfast", foodName: "Coconut Oil Fat Bomb",            portionGrams: 30,  unit: "g", calories: 259, carbs: 0,   fat: 28,   protein: 0.5 },
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
          { mealType: "breakfast", foodName: "Pecans and Raspberries",          portionGrams: 40,  unit: "g", calories: 200, carbs: 5,   fat: 18,   protein: 3 },
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
          { mealType: "breakfast", foodName: "Hemp Seeds with Heavy Cream",     portionGrams: 45,  unit: "g", calories: 270, carbs: 1.5, fat: 24,   protein: 10 },
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
    { name: "Emma Thompson",    dateOfBirth: "2019-03-15", gender: "female", parentName: "Mary Thompson",    parentContact: "+1-555-0101", phase: 2, baseWeight: 12.4 },
    { name: "Liam Carter",      dateOfBirth: "2018-07-22", gender: "male",   parentName: "John Carter",      parentContact: "+1-555-0102", phase: 1, baseWeight: 14.8 },
    { name: "Olivia Martinez",  dateOfBirth: "2020-01-10", gender: "female", parentName: "Rosa Martinez",    parentContact: "+1-555-0103", phase: 3, baseWeight: 11.2 },
    { name: "Noah Williams",    dateOfBirth: "2017-11-05", gender: "male",   parentName: "James Williams",   parentContact: "+1-555-0104", phase: 4, baseWeight: 18.6 },
    { name: "Ava Brown",        dateOfBirth: "2019-09-28", gender: "female", parentName: "Lisa Brown",       parentContact: "+1-555-0105", phase: 2, baseWeight: 13.0 },
    { name: "Ethan Davis",      dateOfBirth: "2018-04-17", gender: "male",   parentName: "Robert Davis",     parentContact: "+44-7700-900106", phase: 1, baseWeight: 15.2 },
    { name: "Sophia Wilson",    dateOfBirth: "2020-06-03", gender: "female", parentName: "Jennifer Wilson",  parentContact: "+1-555-0107", phase: 2, baseWeight: 10.8 },
    { name: "Mason Miller",     dateOfBirth: "2016-12-19", gender: "male",   parentName: "David Miller",     parentContact: "+1-555-0108", phase: 3, baseWeight: 20.4 },
    { name: "Isabella Moore",   dateOfBirth: "2019-05-11", gender: "female", parentName: "Sarah Moore",      parentContact: "+1-555-0109", phase: 1, baseWeight: 13.6 },
    { name: "Lucas Taylor",     dateOfBirth: "2017-08-30", gender: "male",   parentName: "Mark Taylor",      parentContact: "+44-7700-900110", phase: 4, baseWeight: 19.2 },
    { name: "Mia Anderson",     dateOfBirth: "2021-02-14", gender: "female", parentName: "Karen Anderson",   parentContact: "+1-555-0111", phase: 1, baseWeight: 9.4 },
    { name: "Aiden Jackson",    dateOfBirth: "2018-10-07", gender: "male",   parentName: "Paul Jackson",     parentContact: "+1-555-0112", phase: 2, baseWeight: 16.0 },
    { name: "Charlotte White",  dateOfBirth: "2020-04-22", gender: "female", parentName: "Nancy White",      parentContact: "+1-555-0113", phase: 3, baseWeight: 11.8 },
    { name: "James Harris",     dateOfBirth: "2017-01-18", gender: "male",   parentName: "Brian Harris",     parentContact: "+61-4-0000-0114", phase: 4, baseWeight: 21.0 },
    { name: "Amelia Clark",     dateOfBirth: "2019-12-09", gender: "female", parentName: "Susan Clark",      parentContact: "+1-555-0115", phase: 2, baseWeight: 13.8 },
  ];

  const completionRates = [0.90, 0.42, 0.85, 0.95, 0.28, 0.70, 0.88, 0.62, 0.75, 0.45, 0.92, 0.55, 0.82, 0.38, 0.78];

  const phaseSettings: Record<number, { ketoRatio: number; dailyCalories: number; dailyCarbs: number; dailyFat: number; dailyProtein: number }> = {
    1: { ketoRatio: 2, dailyCalories: 1000, dailyCarbs: 25, dailyFat: 85,  dailyProtein: 35 },
    2: { ketoRatio: 3, dailyCalories: 1200, dailyCarbs: 20, dailyFat: 100, dailyProtein: 40 },
    3: { ketoRatio: 4, dailyCalories: 1400, dailyCarbs: 15, dailyFat: 120, dailyProtein: 45 },
    4: { ketoRatio: 4, dailyCalories: 1600, dailyCarbs: 20, dailyFat: 135, dailyProtein: 50 },
  };

  const createdKids: { id: number; phase: number; name: string }[] = [];

  for (const kid of kidsData) {
    const { baseWeight, ...kidFields } = kid;
    const [created] = await db
      .insert(kidsTable)
      .values({
        ...kidFields,
        kidCode: `KKC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        doctorId,
      })
      .returning();
    if (created) createdKids.push({ ...created, name: kid.name });
  }

  for (let i = 0; i < createdKids.length; i++) {
    const kid = createdKids[i];
    const med = phaseSettings[kid.phase] ?? phaseSettings[2];
    const baseWeight = kidsData[i].baseWeight;

    await db.insert(medicalSettingsTable).values({
      kidId: kid.id,
      phase: kid.phase,
      ...med,
      showAllFoods: true,
      showAllRecipes: true,
    });

    // Weight records — 12 weekly entries with realistic progression
    for (let w = 0; w < 12; w++) {
      const date = new Date();
      date.setDate(date.getDate() - (11 - w) * 7);
      const trend = completionRates[i] > 0.7 ? 0.15 : -0.05;
      await db.insert(weightRecordsTable).values({
        kidId: kid.id,
        weight: Math.round((baseWeight + w * trend + (Math.random() - 0.5) * 0.2) * 10) / 10,
        date: date.toISOString().split("T")[0],
        note: w === 11 ? "Most recent clinic measurement" : w === 5 ? "Mid-protocol review" : null,
      });
    }

    // Ketone readings — 8 readings over the last 4 weeks
    const ketoneBase = kid.phase >= 3 ? 3.2 : kid.phase === 2 ? 2.0 : 1.2;
    for (let k = 0; k < 8; k++) {
      const date = new Date();
      date.setDate(date.getDate() - k * 4);
      await db.insert(ketoneReadingsTable).values({
        kidId: kid.id,
        value: Math.round((ketoneBase + (Math.random() - 0.5) * 0.8) * 10) / 10,
        date: date.toISOString().split("T")[0],
        notes: k === 0 ? "Home monitoring reading" : null,
      }).catch(() => {});
    }

    // Meal days — 35 days
    const rate = completionRates[i] ?? 0.7;
    for (let d = 34; d >= 0; d--) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      const totalMeals = 5;
      const completedMeals = Math.max(0, Math.min(totalMeals, Math.round(totalMeals * rate + (Math.random() - 0.5))));
      const missedMeals = totalMeals - completedMeals;
      await db.insert(mealDaysTable).values({
        kidId: kid.id,
        date: date.toISOString().split("T")[0],
        totalMeals,
        completedMeals,
        missedMeals,
        isFilled: d < 30,
        totalCalories: completedMeals * (med.dailyCalories / totalMeals),
        totalCarbs: completedMeals * (med.dailyCarbs / totalMeals),
        totalFat: completedMeals * (med.dailyFat / totalMeals),
        totalProtein: completedMeals * (med.dailyProtein / totalMeals),
      });
    }
  }

  // Clinical notes for all kids
  const noteContents = [
    "Patient maintaining excellent keto compliance. Parents report good tolerance with no adverse GI effects. Continue current 3:1 protocol.",
    "Weight slightly below target range. Recommended calorie increase of 10%. Parents given revised meal plan guidance. Follow-up in 2 weeks.",
    "Seizure frequency reduced by 60% since initiating ketogenic therapy. Blood ketones consistently 3.0–4.2 mmol/L. Excellent therapeutic response.",
    "Parents experiencing meal prep difficulties. Referred to specialist dietitian for hands-on support session. Will reassess compliance at next visit.",
    "Blood ketone levels consistently above 2.0 mmol/L. Therapy is working well. Patient is alert and growing appropriately for age.",
    "New patient — completing phase 1 induction week. Family educated on carb counting and meal weighing. Tolerating diet well.",
    "Patient in phase 2 with stable seizure control. Slight weight gain this month, adjusting fat ratios accordingly.",
    "Increased ketone target to 3.5 mmol/L for better seizure control. Monitoring blood glucose for hypoglycemia risk.",
    "Phase 1 patient showing improvement. First ketone reading of 1.8 mmol/L achieved. Parents very motivated and compliant.",
    "Phase 4 maintenance — patient doing well, transitioning slowly off strict keto. Carb allowance increased to 20g/day.",
    "Youngest patient in the program. Parents diligent with measurements. Ketones at 1.2 mmol/L — target range for phase 1.",
    "Mid-protocol review: Good seizure reduction (approx 45%). Meal completion at 55%, needs improvement. Reviewed barriers with family.",
    "Seizure-free for 3 weeks following intensification to 4:1 ratio. Ketones averaging 3.8 mmol/L. Exceptional response.",
    "Longstanding keto patient — 4 years on diet. Considering weaning protocol. Will discuss with neurology team.",
    "Stable phase 2 patient. Parents report improved energy and concentration at school. Meal completion rate improving steadily.",
  ];

  for (let i = 0; i < createdKids.length; i++) {
    await db.insert(notesTable).values({
      kidId: createdKids[i].id,
      doctorId,
      doctorName: "Dr. Sarah Johnson",
      content: noteContents[i] ?? "Regular monitoring note. Patient progressing as expected.",
    });
  }

  console.log(`Kids seeded: ${createdKids.length} total`);
  console.log("Seeding complete!");
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});

import { db } from "@workspace/db";
import {
  doctorsTable,
  kidsTable,
  medicalSettingsTable,
  weightRecordsTable,
  mealDaysTable,
  notesTable,
} from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  const [doctor] = await db
    .insert(doctorsTable)
    .values({
      username: "doctor",
      password: "doctor123",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@hospital.com",
      specialty: "Pediatric Neurology",
    })
    .onConflictDoNothing()
    .returning();

  const doctorId = doctor?.id ?? 1;
  console.log("Doctor created:", doctorId);

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

  const createdKids = [];
  for (const kid of kidsData) {
    const [created] = await db
      .insert(kidsTable)
      .values({
        ...kid,
        kidCode: `KID-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        doctorId,
      })
      .onConflictDoNothing()
      .returning();
    if (created) createdKids.push(created);
  }

  console.log("Kids created:", createdKids.length);

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

  for (let i = 0; i < createdKids.length; i++) {
    const kid = createdKids[i];
    const med = medicalDefaults[i] || medicalDefaults[0];
    await db.insert(medicalSettingsTable).values({
      kidId: kid.id,
      ...med,
      showAllFoods: true,
      showAllRecipes: true,
    }).onConflictDoNothing();
  }

  // Weight records
  for (let i = 0; i < createdKids.length; i++) {
    const kid = createdKids[i];
    const baseWeight = 12 + i * 1.5;
    for (let w = 0; w < 6; w++) {
      const date = new Date();
      date.setDate(date.getDate() - (5 - w) * 14);
      await db.insert(weightRecordsTable).values({
        kidId: kid.id,
        weight: Math.round((baseWeight + w * 0.3) * 10) / 10,
        date: date.toISOString().split("T")[0],
        note: w === 5 ? "Latest measurement" : null,
      }).onConflictDoNothing();
    }
  }

  // Meal days - some kids have poor completion to show high risk
  const completionRates = [0.9, 0.4, 0.85, 0.95, 0.3, 0.7, 0.88, 0.6];
  for (let i = 0; i < createdKids.length; i++) {
    const kid = createdKids[i];
    const rate = completionRates[i] || 0.7;
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
      }).onConflictDoNothing();
    }
  }

  // Private notes
  for (const kid of createdKids.slice(0, 3)) {
    await db.insert(notesTable).values({
      kidId: kid.id,
      doctorId,
      doctorName: "Dr. Sarah Johnson",
      content: "Please ensure the child maintains the keto ratio as prescribed. Monitor weight weekly.",
    }).onConflictDoNothing();
  }

  console.log("Seeding complete!");
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});

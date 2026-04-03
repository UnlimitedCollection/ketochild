import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { kidsTable, weightRecordsTable, mealDaysTable, mealLogsTable, notesTable, doctorsTable, foodsTable, parentTokensTable, recipesTable } from "@workspace/db";
import { eq, gte, desc, inArray, count } from "drizzle-orm";
import { calcAgeMonths } from "../lib/utils";

const router: IRouter = Router();

router.get("/stats", async (req, res) => {
  const doctorId = req.session.doctorId!;
  const isAdmin = req.session.doctorRole === "admin";

  try {
    const allKids = isAdmin
      ? await db.select().from(kidsTable).where(eq(kidsTable.doctorId, doctorId))
      : await db.select().from(kidsTable);

    const totalChildren = allKids.length;
    const kidIds = allKids.map((k) => k.id);

    if (kidIds.length === 0) {
      const [{ value: totalDoctors }] = await db.select({ value: count() }).from(doctorsTable);
      const [{ value: totalFoods }] = await db.select({ value: count() }).from(foodsTable).where(eq(foodsTable.isActive, true));
      const [{ value: totalRecipes }] = await db.select({ value: count() }).from(recipesTable);
      res.json({
        totalChildren: 0,
        highRiskChildren: 0,
        unfilledMealRecords: 0,
        last24hUnfilledMealRecords: 0,
        averageWeightChange: 0,
        dietTypeDistribution: [
          { dietType: "classic", count: 0, label: "Classic Ketogenic Diet" },
          { dietType: "mad", count: 0, label: "Modified Atkins Diet" },
          { dietType: "mct", count: 0, label: "MCT Diet" },
          { dietType: "lowgi", count: 0, label: "Low GI Diet" },
        ],
        recentHighRiskKids: [],
        totalDoctors: Number(totalDoctors),
        totalFoods: Number(totalFoods),
        totalRecipes: Number(totalRecipes),
        tokenSummary: { active: 0, used: 0, expired: 0, total: 0 },
      });
      return;
    }

    const cutoff24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const allMealDays = await db.select().from(mealDaysTable);
    const recentMealDays = allMealDays.filter((m) => kidIds.includes(m.kidId));

    const last24hLogs = await db
      .select()
      .from(mealLogsTable)
      .where(gte(mealLogsTable.createdAt, cutoff24h));
    const last24hUnfilledMealRecords = last24hLogs
      .filter((l) => kidIds.includes(l.kidId) && !l.isCompleted)
      .length;

    const kidMealStats = new Map<number, { filled: number; total: number }>();
    for (const m of recentMealDays) {
      if (!kidMealStats.has(m.kidId)) kidMealStats.set(m.kidId, { filled: 0, total: 0 });
      const stats = kidMealStats.get(m.kidId)!;
      stats.total++;
      if (m.isFilled) stats.filled++;
    }

    let highRiskChildren = 0;
    let unfilledMealRecords = 0;
    const recentHighRiskKids: unknown[] = [];

    for (const kid of allKids) {
      const stats = kidMealStats.get(kid.id) || { filled: 0, total: 0 };
      const completionRate = stats.total > 0 ? stats.filled / stats.total : 0;
      unfilledMealRecords += stats.total - stats.filled;

      const isHighRisk = completionRate < 0.6 && stats.total > 0;
      if (isHighRisk) {
        highRiskChildren++;
        if (recentHighRiskKids.length < 5) {
          recentHighRiskKids.push({
            id: kid.id,
            name: kid.name,
            ageMonths: calcAgeMonths(kid.dateOfBirth),
            dietType: kid.dietType,
            parentContact: kid.parentContact,
            riskReason: "Poor meal completion rate",
            mealCompletionRate: completionRate,
          });
        }
      }
    }

    const dietTypeLabels: Record<string, string> = {
      classic: "Classic Ketogenic Diet",
      mad: "Modified Atkins Diet",
      mct: "MCT Diet",
      lowgi: "Low GI Diet",
    };
    const dietTypeCountMap = new Map<string, number>();
    for (const kid of allKids) {
      dietTypeCountMap.set(kid.dietType, (dietTypeCountMap.get(kid.dietType) || 0) + 1);
    }
    const dietTypeDistribution = ["classic", "mad", "mct", "lowgi"].map((dt) => ({
      dietType: dt,
      count: dietTypeCountMap.get(dt) || 0,
      label: dietTypeLabels[dt] || dt,
    }));

    const allWeights = await db.select().from(weightRecordsTable);
    const ownedWeights = allWeights.filter((w) => kidIds.includes(w.kidId));

    const kidWeights = new Map<number, { weight: number; date: string }[]>();
    for (const w of ownedWeights) {
      if (!kidWeights.has(w.kidId)) kidWeights.set(w.kidId, []);
      kidWeights.get(w.kidId)!.push({ weight: w.weight, date: w.date });
    }

    let totalWeightChange = 0;
    let weightChangeCount = 0;
    for (const [, weights] of kidWeights) {
      if (weights.length >= 2) {
        weights.sort((a, b) => a.date.localeCompare(b.date));
        totalWeightChange += weights[weights.length - 1].weight - weights[0].weight;
        weightChangeCount++;
      }
    }

    const [{ value: totalDoctors }] = await db.select({ value: count() }).from(doctorsTable);
    const [{ value: totalFoods }] = await db.select({ value: count() }).from(foodsTable).where(eq(foodsTable.isActive, true));
    const [{ value: totalRecipes }] = isAdmin
      ? await db.select({ value: count() }).from(recipesTable).where(eq(recipesTable.doctorId, doctorId))
      : await db.select({ value: count() }).from(recipesTable);

    let tokenSummary = { active: 0, used: 0, expired: 0, total: 0 };
    if (kidIds.length > 0) {
      const tokens = await db.select().from(parentTokensTable).where(inArray(parentTokensTable.kidId, kidIds));
      const now = new Date();
      for (const t of tokens) {
        tokenSummary.total++;
        if (t.status === "revoked" || new Date(t.expiresAt) < now) {
          tokenSummary.expired++;
        } else if (t.status === "used") {
          tokenSummary.used++;
        } else {
          tokenSummary.active++;
        }
      }
    }

    res.json({
      totalChildren,
      highRiskChildren,
      unfilledMealRecords,
      last24hUnfilledMealRecords,
      averageWeightChange: weightChangeCount > 0
        ? Math.round((totalWeightChange / weightChangeCount) * 100) / 100
        : 0,
      dietTypeDistribution,
      recentHighRiskKids,
      totalDoctors: Number(totalDoctors),
      totalFoods: Number(totalFoods),
      totalRecipes: Number(totalRecipes),
      tokenSummary,
    });
  } catch (err) {
    req.log.error({ err }, "Dashboard stats error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.get("/recent-activity", async (req, res) => {
  const doctorId = req.session.doctorId!;
  const isAdmin = req.session.doctorRole === "admin";

  try {
    const allKids = isAdmin
      ? await db
          .select({ id: kidsTable.id, name: kidsTable.name, dietType: kidsTable.dietType })
          .from(kidsTable)
          .where(eq(kidsTable.doctorId, doctorId))
      : await db
          .select({ id: kidsTable.id, name: kidsTable.name, dietType: kidsTable.dietType })
          .from(kidsTable);

    const kidIds = allKids.map((k) => k.id);
    const kidMap = new Map(allKids.map((k) => [k.id, k]));

    if (kidIds.length === 0) {
      res.json([]);
      return;
    }

    const ownedNotes = await db
      .select()
      .from(notesTable)
      .where(inArray(notesTable.kidId, kidIds))
      .orderBy(desc(notesTable.createdAt))
      .limit(5);

    const ownedWeights = await db
      .select()
      .from(weightRecordsTable)
      .where(inArray(weightRecordsTable.kidId, kidIds))
      .orderBy(desc(weightRecordsTable.createdAt))
      .limit(5);

    type ActivityItem = {
      type: string;
      title: string;
      description: string;
      kidId: number;
      kidName: string;
      timestamp: string;
    };

    const activity: ActivityItem[] = [];

    for (const note of ownedNotes) {
      const kid = kidMap.get(note.kidId!);
      if (!kid) continue;
      activity.push({
        type: "note",
        title: "Note added",
        description: note.content.length > 80 ? note.content.slice(0, 80) + "…" : note.content,
        kidId: kid.id,
        kidName: kid.name,
        timestamp: note.createdAt.toISOString(),
      });
    }

    for (const w of ownedWeights) {
      const kid = kidMap.get(w.kidId);
      if (!kid) continue;
      activity.push({
        type: "weight",
        title: "Weight recorded",
        description: `${w.weight} kg recorded${w.note ? ` — ${w.note}` : ""}`,
        kidId: kid.id,
        kidName: kid.name,
        timestamp: w.createdAt.toISOString(),
      });
    }

    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json(activity.slice(0, 5));
  } catch (err) {
    req.log.error({ err }, "Recent activity error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;

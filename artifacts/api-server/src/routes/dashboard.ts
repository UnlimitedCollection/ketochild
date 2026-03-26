import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { kidsTable, weightRecordsTable, mealDaysTable, mealLogsTable } from "@workspace/db";
import { eq, gte, and } from "drizzle-orm";

const router: IRouter = Router();

function calcAgeMonths(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  return (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
}

router.get("/stats", async (req, res) => {
  try {
    const allKids = await db.select().from(kidsTable);
    const totalChildren = allKids.length;

    const cutoff24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentMealDays = await db.select().from(mealDaysTable);
    const last24hLogs = await db.select().from(mealLogsTable).where(gte(mealLogsTable.createdAt, cutoff24h));

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

    const last24hUnfilledMealRecords = last24hLogs.filter(l => !l.isCompleted).length;

    for (const kid of allKids) {
      const stats = kidMealStats.get(kid.id) || { filled: 0, total: 0 };
      const completionRate = stats.total > 0 ? stats.filled / stats.total : 0;
      const unfilled = stats.total - stats.filled;
      unfilledMealRecords += unfilled;

      const isHighRisk = completionRate < 0.6 && stats.total > 0;
      if (isHighRisk) {
        highRiskChildren++;
        if (recentHighRiskKids.length < 5) {
          recentHighRiskKids.push({
            id: kid.id,
            name: kid.name,
            ageMonths: calcAgeMonths(kid.dateOfBirth),
            phase: kid.phase,
            parentContact: kid.parentContact,
            riskReason: "Poor meal completion rate",
            mealCompletionRate: completionRate,
          });
        }
      }
    }

    const phaseCountMap = new Map<number, number>();
    for (const kid of allKids) {
      phaseCountMap.set(kid.phase, (phaseCountMap.get(kid.phase) || 0) + 1);
    }

    const phaseDistribution = [1, 2, 3, 4].map((p) => ({
      phase: p,
      count: phaseCountMap.get(p) || 0,
      label: `Phase ${p}`,
    }));

    const allWeights = await db.select().from(weightRecordsTable);
    let totalWeightChange = 0;
    let weightChangeCount = 0;

    const kidWeights = new Map<number, { weight: number; date: string }[]>();
    for (const w of allWeights) {
      if (!kidWeights.has(w.kidId)) kidWeights.set(w.kidId, []);
      kidWeights.get(w.kidId)!.push({ weight: w.weight, date: w.date });
    }

    for (const [, weights] of kidWeights) {
      if (weights.length >= 2) {
        weights.sort((a, b) => a.date.localeCompare(b.date));
        const change = weights[weights.length - 1].weight - weights[0].weight;
        totalWeightChange += change;
        weightChangeCount++;
      }
    }

    const averageWeightChange = weightChangeCount > 0 ? totalWeightChange / weightChangeCount : 0;

    res.json({
      totalChildren,
      highRiskChildren,
      unfilledMealRecords,
      last24hUnfilledMealRecords,
      averageWeightChange: Math.round(averageWeightChange * 100) / 100,
      phaseDistribution,
      recentHighRiskKids,
    });
  } catch (err) {
    req.log.error({ err }, "Dashboard stats error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;

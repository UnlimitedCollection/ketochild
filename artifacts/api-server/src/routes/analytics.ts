import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  kidsTable,
  weightRecordsTable,
  mealDaysTable,
  ketoneReadingsTable,
} from "@workspace/db";
import { gte, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/population", async (req, res) => {
  try {
    const now = new Date();

    const allKids = await db.select().from(kidsTable);
    const kidIds = allKids.map((k) => k.id);

    if (kidIds.length === 0) {
      res.json({
        weeklyCompliance: [],
        phaseDistribution: [],
        patientCompliance: [],
        ketoneDistribution: { low: 0, optimal: 0, high: 0, total: 0 },
        weightTrend: [],
        genderDistribution: [],
      });
      return;
    }

    // ─── Weekly compliance trend (last 8 weeks) ─────────────────────────────
    const eightWeeksAgo = new Date(now);
    eightWeeksAgo.setDate(now.getDate() - 56);

    const allMealDays = await db
      .select()
      .from(mealDaysTable)
      .where(gte(mealDaysTable.date, eightWeeksAgo.toISOString().slice(0, 10)));

    const weekBuckets: Record<string, { filled: number; total: number }> = {};
    for (let w = 0; w < 8; w++) {
      const d = new Date(now);
      d.setDate(now.getDate() - (7 - w) * 7);
      const wk = `W${8 - w}`;
      weekBuckets[wk] = { filled: 0, total: 0 };
    }

    for (const day of allMealDays) {
      const dayDate = new Date(day.date);
      const diffDays = Math.floor((now.getTime() - dayDate.getTime()) / 86400000);
      if (diffDays > 56) continue;
      const weekIndex = Math.floor(diffDays / 7);
      const weekKey = `W${weekIndex + 1}`;
      if (!weekBuckets[weekKey]) weekBuckets[weekKey] = { filled: 0, total: 0 };
      weekBuckets[weekKey].total++;
      if (day.isFilled) weekBuckets[weekKey].filled++;
    }

    const weeklyCompliance = Object.entries(weekBuckets)
      .reverse()
      .map(([week, { filled, total }]) => ({
        week,
        compliance: total > 0 ? Math.round((filled / total) * 100) : null,
        filled,
        total,
      }));

    // ─── Phase distribution ─────────────────────────────────────────────────
    const phaseCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const kid of allKids) {
      phaseCounts[kid.phase] = (phaseCounts[kid.phase] ?? 0) + 1;
    }
    const phaseDistribution = [1, 2, 3, 4].map((p) => ({
      phase: p,
      label: `Phase ${p}`,
      count: phaseCounts[p] ?? 0,
    }));

    // ─── Gender distribution ────────────────────────────────────────────────
    const genderCounts: Record<string, number> = {};
    for (const kid of allKids) {
      const g = kid.gender ?? "Unknown";
      genderCounts[g] = (genderCounts[g] ?? 0) + 1;
    }
    const genderDistribution = Object.entries(genderCounts).map(([gender, count]) => ({
      gender,
      count,
    }));

    // ─── Per-patient compliance summary ─────────────────────────────────────
    const allKidMealDays = await db.select().from(mealDaysTable);
    const kidMealMap: Record<number, { filled: number; total: number }> = {};
    for (const day of allKidMealDays) {
      if (!kidMealMap[day.kidId]) kidMealMap[day.kidId] = { filled: 0, total: 0 };
      kidMealMap[day.kidId].total++;
      if (day.isFilled) kidMealMap[day.kidId].filled++;
    }

    const patientCompliance = allKids
      .map((kid) => {
        const stats = kidMealMap[kid.id] ?? { filled: 0, total: 0 };
        const rate = stats.total > 0 ? Math.round((stats.filled / stats.total) * 100) : null;
        return {
          id: kid.id,
          name: kid.name,
          phase: kid.phase,
          gender: kid.gender,
          complianceRate: rate,
          filledDays: stats.filled,
          totalDays: stats.total,
          risk: rate !== null && rate < 60 && stats.total > 0 ? "high" : rate !== null && rate < 80 ? "moderate" : "good",
        };
      })
      .sort((a, b) => {
        if (a.complianceRate === null) return 1;
        if (b.complianceRate === null) return -1;
        return a.complianceRate - b.complianceRate;
      });

    // ─── Ketone distribution (last 30 days) ─────────────────────────────────
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const recentKetones = await db
      .select()
      .from(ketoneReadingsTable)
      .where(gte(ketoneReadingsTable.date, thirtyDaysAgo.toISOString().slice(0, 10)));

    const ketoneDist = { low: 0, optimal: 0, high: 0, total: recentKetones.length };
    for (const k of recentKetones) {
      if (k.value < 1.0) ketoneDist.low++;
      else if (k.value <= 3.0) ketoneDist.optimal++;
      else ketoneDist.high++;
    }

    // ─── Weight trend (monthly avg change, last 6 months) ───────────────────
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const recentWeights = await db
      .select()
      .from(weightRecordsTable)
      .where(gte(weightRecordsTable.date, sixMonthsAgo.toISOString().slice(0, 10)))
      .orderBy(desc(weightRecordsTable.date));

    const monthlyWeights: Record<string, number[]> = {};
    for (const w of recentWeights) {
      const month = w.date.slice(0, 7);
      if (!monthlyWeights[month]) monthlyWeights[month] = [];
      monthlyWeights[month].push(w.weight);
    }

    const weightTrend = Object.entries(monthlyWeights)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, weights]) => {
        const avg = weights.reduce((s, v) => s + v, 0) / weights.length;
        const [yr, mo] = month.split("-");
        const label = new Date(Number(yr), Number(mo) - 1, 1).toLocaleString("en", { month: "short", year: "2-digit" });
        return { month, label, avgWeight: Math.round(avg * 10) / 10, count: weights.length };
      });

    res.json({
      weeklyCompliance,
      phaseDistribution,
      patientCompliance,
      ketoneDistribution: ketoneDist,
      weightTrend,
      genderDistribution,
    });
  } catch (err) {
    req.log.error({ err }, "Analytics population error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;

import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  useGetKid,
  useGetKidMealLogs,
  useGetKidKetoneReadings,
  type MealLog,
  type MedicalSettings,
  type KetoneReading,
} from "@workspace/api-client-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Loader2,
  CheckCircle2,
  Circle,
  Droplets,
  Coffee,
  Sun,
  Moon,
  UtensilsCrossed,
  Target,
} from "lucide-react";

interface DayAnalyticsDialogProps {
  kidId: number;
  date: string;
  onClose: () => void;
}

const MEAL_TYPE_ICONS: Record<string, React.ReactNode> = {
  Breakfast: <Coffee className="h-3.5 w-3.5" />,
  Lunch: <Sun className="h-3.5 w-3.5" />,
  Snack: <UtensilsCrossed className="h-3.5 w-3.5" />,
  Dinner: <Moon className="h-3.5 w-3.5" />,
};

const MACRO_COLORS = {
  fat: "#f59e0b",
  protein: "#3b82f6",
  carbs: "#10b981",
};

const MEAL_TYPE_COLORS: Record<string, string> = {
  Breakfast: "#f97316",
  Lunch: "#3b82f6",
  Dinner: "#8b5cf6",
  Snack: "#10b981",
};

const MEAL_TYPE_ORDER = ["Breakfast", "Lunch", "Dinner", "Snack"];

function getStatusColor(actual: number, target: number): string {
  if (target <= 0) return "bg-slate-300";
  const ratio = actual / target;
  if (ratio >= 0.85 && ratio <= 1.15) return "bg-green-500";
  if (ratio >= 0.7 && ratio <= 1.3) return "bg-amber-400";
  return "bg-red-500";
}

function getStatusBadge(actual: number, target: number): { label: string; className: string } {
  if (target <= 0) return { label: "N/A", className: "bg-slate-100 text-slate-500" };
  const ratio = actual / target;
  if (ratio >= 0.85 && ratio <= 1.15) return { label: "On Track", className: "bg-green-50 text-green-700" };
  if (ratio >= 0.7 && ratio <= 1.3) return { label: "Close", className: "bg-amber-50 text-amber-700" };
  if (ratio < 0.7) return { label: "Under", className: "bg-red-50 text-red-600" };
  return { label: "Over", className: "bg-red-50 text-red-600" };
}

function getKetoneStatus(value: number): { label: string; color: string; bgColor: string } {
  if (value < 0.5) return { label: "Below Range", color: "text-slate-500", bgColor: "bg-slate-100" };
  if (value < 1.5) return { label: "Sub-therapeutic", color: "text-orange-600", bgColor: "bg-orange-50" };
  if (value <= 6.0) return { label: "Therapeutic", color: "text-emerald-700", bgColor: "bg-emerald-50" };
  if (value <= 8.0) return { label: "High", color: "text-amber-700", bgColor: "bg-amber-50" };
  return { label: "Dangerously High", color: "text-red-700", bgColor: "bg-red-50" };
}

interface MealTypeAggregate {
  mealType: string;
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
}

function MacroTargetRow({
  label,
  actual,
  target,
  unit,
  color,
}: {
  label: string;
  actual: number;
  target: number;
  unit: string;
  color: string;
}) {
  const pct = target > 0 ? Math.min((actual / target) * 100, 150) : 0;
  const barWidth = Math.min(pct, 100);
  const statusColor = getStatusColor(actual, target);
  const badge = getStatusBadge(actual, target);

  return (
    <div className="p-2.5 rounded-lg border border-slate-100 bg-white">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-semibold text-slate-700">{label}</span>
        </div>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.className}`}>
          {badge.label}
        </span>
      </div>
      <div className="flex items-center gap-3 mb-1">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${statusColor}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-800 tabular-nums whitespace-nowrap">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="flex items-center justify-between text-[10px] text-slate-500">
        <span>Achieved: <span className="font-semibold text-slate-700">{Math.round(actual)}{unit}</span></span>
        <span className="flex items-center gap-0.5">
          <Target className="h-2.5 w-2.5" />
          Target: <span className="font-semibold text-slate-700">{Math.round(target)}{unit}</span>
        </span>
      </div>
    </div>
  );
}

function MealAllocationPieChart({ mealAggregates, totalCalories }: { mealAggregates: MealTypeAggregate[]; totalCalories: number }) {
  const pieData = mealAggregates
    .filter((m) => m.calories > 0)
    .map((m) => ({
      name: m.mealType,
      value: Math.round(m.calories),
      color: MEAL_TYPE_COLORS[m.mealType] || "#94a3b8",
      pct: totalCalories > 0 ? Math.round((m.calories / totalCalories) * 100) : 0,
    }));

  if (pieData.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Calorie Allocation by Meal</p>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={50}
                strokeWidth={2}
                stroke="#fff"
                label={({ percent }: { percent: number }) => `${Math.round((percent ?? 0) * 100)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`meal-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} kcal`, name]}
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-slate-500 w-16">{d.name}</span>
              <span className="font-semibold text-slate-800">{d.value} kcal</span>
              <span className="text-slate-400">({d.pct}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MealMacroBreakdownChart({ mealAggregates }: { mealAggregates: MealTypeAggregate[] }) {
  const chartData = mealAggregates
    .filter((m) => m.fat > 0 || m.protein > 0 || m.carbs > 0)
    .map((m) => ({
      name: m.mealType,
      Fat: Math.round(m.fat * 10) / 10,
      Protein: Math.round(m.protein * 10) / 10,
      Carbs: Math.round(m.carbs * 10) / 10,
    }));

  if (chartData.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Macros by Meal Type</p>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} unit="g" width={40} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
              formatter={(value: number, name: string) => [`${value}g`, name]}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="Fat" fill={MACRO_COLORS.fat} radius={[2, 2, 0, 0]} />
            <Bar dataKey="Protein" fill={MACRO_COLORS.protein} radius={[2, 2, 0, 0]} />
            <Bar dataKey="Carbs" fill={MACRO_COLORS.carbs} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PerMealSummaryCards({ mealAggregates }: { mealAggregates: MealTypeAggregate[] }) {
  const meals = mealAggregates.filter((m) => m.calories > 0 || m.fat > 0 || m.protein > 0 || m.carbs > 0);
  if (meals.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Per-Meal Breakdown</p>
      <div className="grid grid-cols-2 gap-2">
        {meals.map((m) => (
          <div key={m.mealType} className="p-2.5 rounded-lg border border-slate-100 bg-white">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-slate-400">
                {MEAL_TYPE_ICONS[m.mealType] ?? <UtensilsCrossed className="h-3.5 w-3.5" />}
              </span>
              <span className="text-xs font-semibold text-slate-700">{m.mealType}</span>
            </div>
            <p className="text-sm font-bold text-slate-800 mb-1">{Math.round(m.calories)} kcal</p>
            <div className="flex gap-2 text-[10px] text-slate-500">
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: MACRO_COLORS.fat }} />
                F: {Math.round(m.fat)}g
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: MACRO_COLORS.protein }} />
                P: {Math.round(m.protein)}g
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: MACRO_COLORS.carbs }} />
                C: {Math.round(m.carbs)}g
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DayAnalyticsDialog({ kidId, date, onClose }: DayAnalyticsDialogProps) {
  const { data: profile } = useGetKid(kidId);
  const { data: mealLogs, isLoading: logsLoading } = useGetKidMealLogs(kidId, { date });
  const { data: allKetones, isLoading: ketonesLoading } = useGetKidKetoneReadings(kidId, { limit: 365 });

  const medical: MedicalSettings | undefined = profile?.medical;

  const displayDate = format(parseISO(date), "EEEE, MMM d, yyyy");

  const dayKetone: KetoneReading | undefined = useMemo(() => {
    if (!allKetones) return undefined;
    return allKetones.find((k) => k.date.slice(0, 10) === date);
  }, [allKetones, date]);

  const logsForDay: MealLog[] = useMemo(() => {
    if (!mealLogs) return [];
    return mealLogs;
  }, [mealLogs]);

  const hasMealData = logsForDay.length > 0;
  const hasData = hasMealData || !!dayKetone;

  const totals = useMemo(() => {
    let calories = 0, fat = 0, protein = 0, carbs = 0;
    let completed = 0;
    logsForDay.forEach((l) => {
      calories += l.calories ?? 0;
      fat += l.fat ?? 0;
      protein += l.protein ?? 0;
      carbs += l.carbs ?? 0;
      if (l.isCompleted) completed++;
    });
    return { calories, fat, protein, carbs, completed, total: logsForDay.length };
  }, [logsForDay]);

  const mealAggregates: MealTypeAggregate[] = useMemo(() => {
    const map = new Map<string, MealTypeAggregate>();
    logsForDay.forEach((l) => {
      const existing = map.get(l.mealType) || {
        mealType: l.mealType,
        calories: 0,
        fat: 0,
        protein: 0,
        carbs: 0,
      };
      existing.calories += l.calories ?? 0;
      existing.fat += l.fat ?? 0;
      existing.protein += l.protein ?? 0;
      existing.carbs += l.carbs ?? 0;
      map.set(l.mealType, existing);
    });
    return MEAL_TYPE_ORDER
      .filter((t) => map.has(t))
      .map((t) => map.get(t)!)
      .concat([...map.entries()].filter(([k]) => !MEAL_TYPE_ORDER.includes(k)).map(([, v]) => v));
  }, [logsForDay]);

  const macroDonutData = useMemo(() => {
    const data = [
      { name: "Fat", value: totals.fat, color: MACRO_COLORS.fat },
      { name: "Protein", value: totals.protein, color: MACRO_COLORS.protein },
      { name: "Carbs", value: totals.carbs, color: MACRO_COLORS.carbs },
    ].filter((d) => d.value > 0);
    return data;
  }, [totals]);

  const isLoading = logsLoading || ketonesLoading;

  const mealCompletionPct = totals.total > 0 ? Math.round((totals.completed / totals.total) * 100) : 0;

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{displayDate}</DialogTitle>
          <DialogDescription className="sr-only">Daily analytics for {displayDate}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !hasData ? (
          <div className="text-center py-10">
            <Circle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">No data recorded</p>
            <p className="text-xs text-slate-400 mt-1">No meals were logged for this day.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {hasMealData && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Meal Completion</span>
                  <span className="text-sm font-bold text-slate-800">
                    {totals.completed}/{totals.total} ({mealCompletionPct}%)
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${mealCompletionPct}%` }}
                  />
                </div>
              </div>
            )}

            {hasMealData && medical && (
              <div>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Target vs Achieved</p>
                <div className="space-y-2">
                  <MacroTargetRow label="Calories" actual={totals.calories} target={medical.dailyCalories} unit=" kcal" color="#6366f1" />
                  <MacroTargetRow label="Fat" actual={totals.fat} target={medical.dailyFat} unit="g" color={MACRO_COLORS.fat} />
                  <MacroTargetRow label="Protein" actual={totals.protein} target={medical.dailyProtein} unit="g" color={MACRO_COLORS.protein} />
                  <MacroTargetRow label="Carbs" actual={totals.carbs} target={medical.dailyCarbs} unit="g" color={MACRO_COLORS.carbs} />
                </div>
              </div>
            )}

            {macroDonutData.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Macro Breakdown</p>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroDonutData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={45}
                          strokeWidth={2}
                          stroke="#fff"
                        >
                          {macroDonutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [`${Math.round(value)}g`, name]}
                          contentStyle={{ fontSize: 11, borderRadius: 8 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {macroDonutData.map((d) => {
                      const totalGrams = totals.fat + totals.protein + totals.carbs;
                      const pct = totalGrams > 0 ? Math.round((d.value / totalGrams) * 100) : 0;
                      return (
                        <div key={d.name} className="flex items-center gap-2 text-xs">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-slate-600">{d.name}</span>
                          <span className="font-semibold text-slate-800">{Math.round(d.value)}g ({pct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <MealAllocationPieChart mealAggregates={mealAggregates} totalCalories={totals.calories} />

            <MealMacroBreakdownChart mealAggregates={mealAggregates} />

            <PerMealSummaryCards mealAggregates={mealAggregates} />

            {dayKetone && (
              <div>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Ketone Reading</p>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <Droplets className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-800">{dayKetone.value}</span>
                      <span className="text-xs text-slate-500">{dayKetone.unit}</span>
                      <span className="text-[10px] text-slate-400 capitalize">({dayKetone.readingType})</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getKetoneStatus(dayKetone.value).bgColor} ${getKetoneStatus(dayKetone.value).color}`}>
                    {getKetoneStatus(dayKetone.value).label}
                  </span>
                </div>
              </div>
            )}

            {hasMealData && (
              <div>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Individual Meals</p>
                <div className="space-y-2">
                  {logsForDay.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-white"
                    >
                      <div className={`mt-0.5 ${meal.isCompleted ? "text-green-500" : "text-slate-300"}`}>
                        {meal.isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">
                            {MEAL_TYPE_ICONS[meal.mealType] ?? <UtensilsCrossed className="h-3.5 w-3.5" />}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">{meal.mealType}</span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${meal.isCompleted ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                            {meal.isCompleted ? "Completed" : "Missed"}
                          </span>
                          {meal.consumptionPercentage != null && (
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${meal.consumptionPercentage >= 80 ? "bg-green-50 text-green-700" : meal.consumptionPercentage >= 50 ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"}`}>
                              {meal.consumptionPercentage}% eaten
                            </span>
                          )}
                        </div>
                        {meal.consumptionPercentage != null && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${meal.consumptionPercentage >= 80 ? "bg-green-500" : meal.consumptionPercentage >= 50 ? "bg-orange-400" : "bg-red-500"}`}
                                style={{ width: `${Math.max(0, Math.min(meal.consumptionPercentage, 100))}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {(meal.calories || meal.fat || meal.protein || meal.carbs) ? (
                          <div className="flex gap-3 mt-1 text-[10px] text-slate-500">
                            {meal.calories != null && <span>{Math.round(meal.calories)} kcal</span>}
                            {meal.fat != null && <span>F: {Math.round(meal.fat)}g</span>}
                            {meal.protein != null && <span>P: {Math.round(meal.protein)}g</span>}
                            {meal.carbs != null && <span>C: {Math.round(meal.carbs)}g</span>}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

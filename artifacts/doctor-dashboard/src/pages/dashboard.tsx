import { useGetDashboardStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";

const PHASE_COLORS = ["#004ac6", "#2563eb", "#855300", "#b45309"];
const BLUE  = "#004ac6";
const AMBER = "#855300";
const RED   = "#ae0010";
const GREEN = "#0a7c42";

const WEEK_DATA = [
  { day: "Mon", compliance: 78, weight: 0.2 },
  { day: "Tue", compliance: 82, weight: 0.1 },
  { day: "Wed", compliance: 75, weight: 0.3 },
  { day: "Thu", compliance: 88, weight: 0.15 },
  { day: "Fri", compliance: 85, weight: 0.2 },
  { day: "Sat", compliance: 91, weight: 0.25 },
  { day: "Sun", compliance: 87, weight: 0.1 },
];

const QUICK_ACTIONS = [
  { label: "Search Child",  icon: "🔍" },
  { label: "Update Weight", icon: "⚖️" },
  { label: "Add Note",      icon: "📝" },
  { label: "Med Controls",  icon: "💊" },
];

const RECENT_ACTIVITY = [
  { color: BLUE,  title: "Ketone review completed", desc: "Level 3.1 mmol/L — within target",    time: "2 min ago"  },
  { color: AMBER, title: "Meal plan updated",       desc: "Phase 1 plan assigned for this week", time: "25 min ago" },
  { color: RED,   title: "High-risk flag raised",   desc: "Weight dropped 5% in 7 days",         time: "1 hr ago"   },
  { color: GREEN, title: "New patient registered",  desc: "Phase 1 initiated",                   time: "3 hr ago"   },
];

function KpiCard({
  label, value, sub, icon, accent, badge,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  accent?: string;
  badge?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-black text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
          style={{ background: accent ? `${accent}18` : "#f1f5f9" }}
        >
          {icon}
        </div>
      </div>
      {badge && (
        <span
          className="self-start px-2.5 py-0.5 rounded-full text-xs font-bold uppercase"
          style={{ background: `${RED}20`, color: RED }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useGetDashboardStats();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-blue-600">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading clinical overview…</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
        <AlertTriangle className="h-10 w-10 text-red-600" />
        <h3 className="text-lg font-bold text-slate-800">Failed to load dashboard</h3>
        <p className="text-sm text-slate-500">Please check your connection or try logging in again.</p>
      </div>
    );
  }

  const phaseData = stats.phaseDistribution;
  const totalPhase = phaseData.reduce((s, p) => s + p.count, 0);

  return (
    <div className="space-y-8 pb-10">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Clinical Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Daily status for Pediatric Ketogenic Therapy</p>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Last Updated: Today, {timeStr}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KpiCard
          label="Total Children"
          value={stats.totalChildren}
          icon="👧"
          accent={BLUE}
        />
        <KpiCard
          label="High-Risk"
          value={stats.highRiskChildren}
          icon="⚠️"
          accent={RED}
          badge="Urgent"
        />
        <KpiCard
          label="Unfilled Records"
          value={stats.last24hUnfilledMealRecords}
          sub={`All-time: ${stats.unfilledMealRecords}`}
          icon="📋"
          accent={AMBER}
        />
        <KpiCard
          label="Avg Weight Change"
          value={`${stats.averageWeightChange > 0 ? "+" : ""}${stats.averageWeightChange} kg`}
          icon="📊"
          accent={GREEN}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-bold text-slate-800 mb-1">Phase Distribution</h2>
          <p className="text-xs text-slate-400 mb-4">Patients across protocol phases</p>
          {phaseData.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No phase data available</p>
          ) : (
            <div className="flex items-center gap-6">
              <div className="relative w-44 h-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={phaseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={72}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="label"
                      strokeWidth={0}
                    >
                      {phaseData.map((_, i) => (
                        <Cell key={i} fill={PHASE_COLORS[i % PHASE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.12)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-2xl font-black text-slate-900">{totalPhase}</p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Total</p>
                </div>
              </div>
              <ul className="flex flex-col gap-2">
                {phaseData.map((ph, i) => (
                  <li key={ph.phase} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: PHASE_COLORS[i % PHASE_COLORS.length] }}
                    />
                    <span className="text-slate-600 font-medium">Phase {ph.phase}</span>
                    <span className="ml-auto font-bold text-slate-800">{ph.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-bold text-slate-800 mb-1">Compliance & Weight Trend</h2>
          <p className="text-xs text-slate-400 mb-4">Weekly overview (illustrative)</p>
          <div className="flex items-center gap-4 mb-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span className="w-6 border-t-2 border-blue-600 inline-block" />
              Compliance
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span className="w-6 border-t-2 border-dashed border-amber-700 inline-block" />
              Weight Δ
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={WEEK_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <RechartsTooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,.12)" }}
              />
              <Line type="monotone" dataKey="compliance" stroke={BLUE}  strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="weight"     stroke={AMBER} strokeWidth={2.5} dot={false} strokeDasharray="5 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">High-Risk Children</h2>
            <Link href="/high-risk" className="text-xs font-bold text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          {stats.recentHighRiskKids.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <p className="text-sm">No high-risk patients currently</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-semibold">Patient</th>
                  <th className="px-4 py-3 text-left font-semibold">Phase</th>
                  <th className="px-4 py-3 text-left font-semibold">Risk</th>
                  <th className="px-4 py-3 text-left font-semibold">Severity</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {stats.recentHighRiskKids.map((kid) => {
                  const isCrit = (kid.mealCompletionRate ?? 0) < 0.3;
                  const initials = kid.name
                    .split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <tr key={kid.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                            style={{ background: isCrit ? RED : AMBER }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{kid.name}</p>
                            <p className="text-[11px] text-slate-400">#{kid.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          Phase {kid.phase ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{kid.riskReason}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            background: isCrit ? `${RED}20`   : `${AMBER}20`,
                            color:      isCrit ? RED           : AMBER,
                          }}
                        >
                          {isCrit ? "Critical" : "Moderate"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/kids/${kid.id}`}
                          className="text-slate-400 hover:text-blue-600 transition-colors font-bold"
                        >
                          →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Missing Records</h2>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: `${AMBER}20`, color: AMBER }}
            >
              {stats.last24hUnfilledMealRecords} Pending
            </span>
          </div>
          {stats.last24hUnfilledMealRecords === 0 && stats.recentHighRiskKids.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <p className="text-sm">All records up to date</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.last24hUnfilledMealRecords > 0 && (
                <div className="flex items-center justify-between px-6 py-3 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🍽️</span>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Unfilled meal logs</p>
                      <p className="text-xs text-slate-400">{stats.last24hUnfilledMealRecords} incomplete in the last 24h</p>
                    </div>
                  </div>
                  <Link
                    href="/high-risk"
                    className="shrink-0 text-xs font-semibold border border-blue-600 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              )}
              {stats.recentHighRiskKids.map((kid) => (
                <div key={kid.id} className="flex items-center justify-between px-6 py-3 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📋</span>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{kid.name}</p>
                      <p className="text-xs text-slate-400">{kid.riskReason}</p>
                    </div>
                  </div>
                  <button
                    className="shrink-0 text-xs font-semibold border border-blue-600 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      if (kid.parentContact) {
                        window.open(`mailto:${kid.parentContact}?subject=Missing%20Records%20Reminder`, "_blank");
                      }
                    }}
                  >
                    Send Reminder
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((qa) => (
              <button key={qa.label} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-blue-600 flex items-center justify-center text-2xl transition-colors">
                  {qa.icon}
                </div>
                <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600 transition-colors text-center">
                  {qa.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-bold text-slate-800 mb-4">Recent Activity</h2>
          <ul className="flex flex-col gap-4">
            {RECENT_ACTIVITY.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-1 w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: a.color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.desc}</p>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}

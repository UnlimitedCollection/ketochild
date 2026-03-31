import { useState, useEffect, useMemo } from "react";
import { usePrint } from "@/hooks/usePrint";
import { usePagination } from "@/hooks/usePagination";
import { PrintLayout } from "@/components/print-layout";
import { Link, useSearch, useLocation } from "wouter";
import { useGetKids, useGetKid, useGetKidKetoneReadings, useDeleteKid, type GetKidsParams } from "@workspace/api-client-react";
import { Search, Filter, Loader2, User, Eye, Flame, Clock, Trash2, Pencil, Scale, FlaskConical, TrendingUp, TrendingDown, Activity, Calendar, Utensils, ChevronLeft, ChevronRight } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { useToast } from "@/hooks/use-toast";
import { useCanWrite } from "@/hooks/useRole";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { format, parseISO, differenceInDays } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

const KETO_STATUS_OPTIONS = [
  { label: "In Keto", value: "true" },
  { label: "Not In Keto", value: "false" },
];

const RISK_OPTIONS = [
  { label: "High Risk", value: "true" },
  { label: "Normal", value: "false" },
];

const PHASE_OPTIONS = [
  { label: "Phase 1", value: "1" },
  { label: "Phase 2", value: "2" },
  { label: "Phase 3", value: "3" },
  { label: "Phase 4", value: "4" },
];

function KidViewDialog({ kidId, open, onOpenChange }: { kidId: number | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const enabled = open && kidId !== null;
  const { data: profile, isLoading, isError } = useGetKid(kidId ?? 0, { query: { enabled } });
  const { data: ketoneReadings } = useGetKidKetoneReadings(
    kidId ?? 0,
    { limit: 1 },
    { query: { enabled } }
  );

  const kid = profile?.kid;
  const medical = profile?.medical;
  const recentWeights = profile?.recentWeights ?? [];
  const recentMeals = profile?.recentMeals ?? [];

  const oldestWeight = recentWeights[0];
  const latestWeight = recentWeights[recentWeights.length - 1];
  const latestKetone = ketoneReadings?.[0];

  const weightChartData = useMemo(
    () => recentWeights.map((w) => ({
      date: format(parseISO(w.date), "MMM d"),
      weight: w.weight,
    })),
    [recentWeights]
  );

  const weightDelta = latestWeight && oldestWeight && recentWeights.length > 1
    ? Number((latestWeight.weight - oldestWeight.weight).toFixed(2))
    : null;

  const mealCompletionPct = kid ? Math.round(kid.mealCompletionRate * 100) : 0;

  const avgDailyCalories = useMemo(() => {
    const filled = recentMeals.filter((m) => m.totalCalories && m.totalCalories > 0);
    if (filled.length === 0) return null;
    return Math.round(filled.reduce((s, m) => s + (m.totalCalories ?? 0), 0) / filled.length);
  }, [recentMeals]);

  const daysInPhase = useMemo(() => {
    if (!kid) return null;
    if (recentWeights.length > 0) {
      return differenceInDays(new Date(), parseISO(recentWeights[0].date));
    }
    return null;
  }, [kid, recentWeights]);

  const ketoneLevel = useMemo(() => {
    if (!latestKetone) return null;
    const v = latestKetone.value;
    if (v < 0.5) return { label: "Low", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    if (v <= 3.0) return { label: "Optimal", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (v <= 5.0) return { label: "High", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
    return { label: "Very High", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  }, [latestKetone]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Patient Overview
          </DialogTitle>
          <DialogDescription className="sr-only">Detailed patient overview with analytics</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError || !kid ? (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 gap-2">
            <p className="text-sm">Failed to load patient details.</p>
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="rounded-xl">Close</Button>
          </div>
        ) : (
          <div className="space-y-5 pt-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{kid.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{kid.kidCode}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Phase {kid.phase}</Badge>
                  {kid.isHighRisk && (
                    <Badge variant="destructive" className="bg-destructive/10 text-destructive border border-destructive/20 text-xs">High Risk</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Personal Information</h3>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs">Age</p>
                        <p className="font-semibold text-slate-800">{kid.ageMonths} months</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Gender</p>
                        <p className="font-semibold text-slate-800 capitalize">{kid.gender ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Date of Birth</p>
                        <p className="font-semibold text-slate-800">{format(parseISO(kid.dateOfBirth), 'MMM d, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Health Status</p>
                        {kid.isHighRisk ? (
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border border-destructive/20 text-xs mt-0.5">High Risk</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs mt-0.5">Stable</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Contact Information</h3>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs">Parent / Guardian</p>
                        <p className="font-semibold text-slate-800">{kid.parentName}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Contact</p>
                        <p className="font-semibold text-slate-800">{kid.parentContact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Clinical KPIs</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                      <div className="flex items-center gap-1.5 text-blue-600 text-xs font-medium mb-1">
                        <Utensils className="h-3.5 w-3.5" /> Meal Completion
                      </div>
                      <p className="text-xl font-bold text-blue-700">{mealCompletionPct}%</p>
                      <div className="mt-1.5 h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${mealCompletionPct}%` }} />
                      </div>
                    </div>

                    <div className="rounded-xl bg-purple-50 border border-purple-100 p-3">
                      <div className="flex items-center gap-1.5 text-purple-600 text-xs font-medium mb-1">
                        <Activity className="h-3.5 w-3.5" /> Keto Ratio
                      </div>
                      <p className="text-xl font-bold text-purple-700">
                        {medical?.ketoRatio ? `${medical.ketoRatio}:1` : '—'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                      <div className="flex items-center gap-1.5 text-amber-600 text-xs font-medium mb-1">
                        <Flame className="h-3.5 w-3.5" /> Daily Calories
                      </div>
                      <div className="text-sm">
                        {medical?.dailyCalories ? (
                          <>
                            <p className="text-xl font-bold text-amber-700">{medical.dailyCalories}</p>
                            {avgDailyCalories !== null && (
                              <p className="text-xs text-amber-600 mt-0.5">Avg actual: {avgDailyCalories}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-xl font-bold text-amber-700">—</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium mb-1">
                        <Scale className="h-3.5 w-3.5" /> Weight Change
                      </div>
                      {weightDelta !== null ? (
                        <div className="flex items-center gap-1">
                          {weightDelta > 0 ? (
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                          ) : weightDelta < 0 ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : null}
                          <p className={`text-xl font-bold ${weightDelta > 0 ? 'text-emerald-700' : weightDelta < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                            {weightDelta > 0 ? '+' : ''}{weightDelta} kg
                          </p>
                        </div>
                      ) : (
                        <p className="text-xl font-bold text-slate-400">—</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div className="text-sm">
                    <span className="text-slate-500">Days in Current Phase: </span>
                    <span className="font-bold text-slate-800">{daysInPhase !== null ? daysInPhase : '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Weight Trend</h3>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                {weightChartData.length >= 2 ? (
                  <div className="h-[160px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 10, fill: "#94a3b8" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "#94a3b8" }}
                          tickLine={false}
                          axisLine={false}
                          domain={["dataMin - 0.5", "dataMax + 0.5"]}
                          unit=" kg"
                        />
                        <RechartsTooltip
                          contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }}
                          formatter={(v: number) => [`${v} kg`, "Weight"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="weight"
                          stroke="#0ea5e9"
                          strokeWidth={2.5}
                          fill="url(#weightGrad)"
                          dot={{ r: 3, fill: "#0ea5e9", strokeWidth: 2, stroke: "#fff" }}
                          activeDot={{ r: 5, fill: "#0d9488", strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[80px] flex flex-col items-center justify-center text-slate-400">
                    <Scale className="h-5 w-5 mb-1 opacity-50" />
                    <p className="text-xs">Not enough weight data for trend chart</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-3.5 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                  <Flame className="h-3.5 w-3.5" /> Keto Status
                </div>
                {kid.inKetoStatus ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 w-fit gap-1 text-xs font-semibold shadow-sm">In Keto</Badge>
                ) : (
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 w-fit text-xs font-semibold shadow-sm">Not in Keto</Badge>
                )}
              </div>
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-3.5 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                  <Scale className="h-3.5 w-3.5" /> Latest Weight
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  {latestWeight ? `${latestWeight.weight} kg` : kid.currentWeight ? `${kid.currentWeight} kg` : '—'}
                </p>
                {latestWeight && (
                  <p className="text-xs text-slate-400">{format(parseISO(latestWeight.date), 'MMM d')}</p>
                )}
              </div>
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-3.5 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                  <FlaskConical className="h-3.5 w-3.5" /> Last Ketone
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  {latestKetone ? `${latestKetone.value} ${latestKetone.unit}` : '—'}
                </p>
                {latestKetone && (
                  <div className="flex items-center gap-2">
                    {ketoneLevel && (
                      <Badge variant="outline" className={`${ketoneLevel.bg} ${ketoneLevel.color} ${ketoneLevel.border} text-xs w-fit`}>
                        {ketoneLevel.label}
                      </Badge>
                    )}
                    <p className="text-xs text-slate-400">{format(parseISO(latestKetone.date), 'MMM d')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function KidsListPage() {
  const searchQuery = useSearch();
  const [, navigate] = useLocation();
  const urlParams = new URLSearchParams(searchQuery);
  const initialSearch = urlParams.get("search") ?? "";
  const { printRef, handlePrint } = usePrint("Patient Directory Report");

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingKid, setDeletingKid] = useState<{ id: number; name: string } | null>(null);
  const [viewingKidId, setViewingKidId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    setSearchTerm(urlParams.get("search") ?? "");
  }, [searchQuery]);

  const canWrite = useCanWrite();
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);
  const [selectedKetoStatus, setSelectedKetoStatus] = useState<string[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<string[]>([]);

  const hasActiveFilters = selectedPhases.length > 0 || selectedKetoStatus.length > 0 || selectedRisk.length > 0;

  const clearAllFilters = () => {
    setSelectedPhases([]);
    setSelectedKetoStatus([]);
    setSelectedRisk([]);
  };

  const apiParams = useMemo((): GetKidsParams => {
    const params: GetKidsParams = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedPhases.length > 0) {
      params.phase = selectedPhases.map(Number) as GetKidsParams["phase"];
    }
    if (selectedRisk.length === 1) {
      params.highRisk = selectedRisk[0] === "true";
    }
    if (selectedKetoStatus.length === 1) {
      params.ketoStatus = selectedKetoStatus[0] === "true";
    }
    return params;
  }, [debouncedSearch, selectedPhases, selectedRisk, selectedKetoStatus]);

  const { data: kids, isLoading } = useGetKids(
    apiParams,
    { query: { queryKey: ["/api/kids", debouncedSearch, selectedPhases, selectedRisk, selectedKetoStatus] } }
  );

  const pagination = usePagination({
    totalItems: kids?.length ?? 0,
    pageSize: 25,
    resetDeps: [debouncedSearch, selectedPhases, selectedRisk, selectedKetoStatus],
  });

  const paginatedKids = useMemo(
    () => (kids ?? []).slice(pagination.startIndex, pagination.endIndex),
    [kids, pagination.startIndex, pagination.endIndex]
  );

  const deleteKidMutation = useDeleteKid({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/kids"] });
        toast({ title: "Patient removed", description: `${deletingKid?.name} has been deleted.` });
        setDeleteDialogOpen(false);
        setDeletingKid(null);
      },
      onError: () => toast({ title: "Failed to delete patient", variant: "destructive" }),
    }
  });

  return (
    <PrintLayout innerRef={printRef} className="space-y-6">
      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Patient Record</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deletingKid?.name}</strong> and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingKid && deleteKidMutation.mutate({ kidId: deletingKid.id })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteKidMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Patient
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Dialog */}
      <KidViewDialog
        kidId={viewingKidId}
        open={viewingKidId !== null}
        onOpenChange={(v) => { if (!v) setViewingKidId(null); }}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Patient Directory
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and monitor all children in the program.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PrintButton onPrint={handlePrint} />
          {canWrite && (
            <Button asChild className="no-print rounded-xl shadow-sm">
              <Link href="/kids/new">+ New Patient</Link>
            </Button>
          )}
        </div>
      </div>

      <Card className="no-print rounded-2xl p-4 shadow-sm border-slate-200 bg-white">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by kid name, ID, or parent..."
              className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <MultiSelectDropdown
              label="Keto Status"
              options={KETO_STATUS_OPTIONS}
              selected={selectedKetoStatus}
              onSelectionChange={setSelectedKetoStatus}
            />
            <MultiSelectDropdown
              label="Risk"
              options={RISK_OPTIONS}
              selected={selectedRisk}
              onSelectionChange={setSelectedRisk}
            />
            <MultiSelectDropdown
              label="Phase"
              options={PHASE_OPTIONS}
              selected={selectedPhases}
              onSelectionChange={setSelectedPhases}
            />
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-slate-500 shrink-0">
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Print-only: summarise active filters */}
      {kids && (
        <p className="hidden print-only text-xs text-slate-500 mb-2">
          Showing {kids.length} patient{kids.length !== 1 ? "s" : ""}
          {hasActiveFilters ? " (filtered)" : " (all)"}
        </p>
      )}

      <Card className="no-print rounded-2xl shadow-sm border-slate-200 overflow-hidden bg-white">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !kids || kids.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500">
            <User className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-lg font-medium text-slate-700">No patients found</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-b-slate-200">
                  <TableHead className="font-semibold text-slate-600">Patient</TableHead>
                  <TableHead className="font-semibold text-slate-600">ID / Code</TableHead>
                  <TableHead className="font-semibold text-slate-600">Phase</TableHead>
                  <TableHead className="font-semibold text-slate-600">Parent Info</TableHead>
                  <TableHead className="font-semibold text-slate-600">Meal Completion</TableHead>
                  <TableHead className="font-semibold text-slate-600">Keto Status</TableHead>
                  <TableHead className="font-semibold text-slate-600">Risk</TableHead>
                  <TableHead className="no-print text-right font-semibold text-slate-600">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedKids.map((kid) => (
                  <TableRow key={kid.id} className="hover:bg-slate-50/80 transition-colors group">
                    <TableCell>
                      <div className="font-bold text-slate-900">{kid.name}</div>
                      <div className="text-xs text-slate-500">{kid.ageMonths} mos • {kid.gender === 'male' ? 'M' : 'F'}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-slate-600">{kid.kidCode}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                        Phase {kid.phase}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm text-slate-700">{kid.parentName}</div>
                      <div className="text-xs text-slate-500">{kid.parentContact}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[80px] h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${kid.mealCompletionRate < 0.5 ? 'bg-destructive' : kid.mealCompletionRate < 0.8 ? 'bg-orange-500' : 'bg-green-500'}`} 
                              style={{ width: `${Math.round(kid.mealCompletionRate * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-600">{Math.round(kid.mealCompletionRate * 100)}%</span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-xs text-slate-400 cursor-default">
                                <Clock className="h-3 w-3" />
                                <span>24h: <span className={`font-semibold ${Math.round((kid.last24hCompletionRate ?? 1) * 100) < 50 ? 'text-destructive' : Math.round((kid.last24hCompletionRate ?? 1) * 100) < 80 ? 'text-orange-500' : 'text-green-600'}`}>{Math.round((kid.last24hCompletionRate ?? 1) * 100)}%</span></span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Last recorded day's meal completion</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              {kid.inKetoStatus ? (
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 gap-1">
                                  <Flame className="h-3 w-3" /> In Keto
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100">
                                  Not in Keto
                                </Badge>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Based on avg carb intake vs target (last 7 days)</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      {kid.isHighRisk ? (
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
                          High Risk
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Stable
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="no-print text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canWrite && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10"
                            onClick={() => navigate(`/kids/${kid.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-lg text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => setViewingKidId(kid.id)}
                          aria-label="View patient"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canWrite && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => { setDeletingKid({ id: kid.id, name: kid.name }); setDeleteDialogOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {kids && kids.length > 0 && (
          <div className="no-print flex items-center justify-between px-6 py-3 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Showing {pagination.rangeStart}–{pagination.rangeEnd} of {kids.length}
            </p>
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={pagination.goPrev}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <span className="text-sm text-slate-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={pagination.goNext}
                  className="gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {kids && kids.length > 0 && (
        <div className="hidden print-section">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left py-1.5 px-2 font-semibold text-slate-600">Patient</th>
                <th className="text-left py-1.5 px-2 font-semibold text-slate-600">ID / Code</th>
                <th className="text-left py-1.5 px-2 font-semibold text-slate-600">Phase</th>
                <th className="text-left py-1.5 px-2 font-semibold text-slate-600">Parent</th>
                <th className="text-left py-1.5 px-2 font-semibold text-slate-600">Meal %</th>
                <th className="text-left py-1.5 px-2 font-semibold text-slate-600">Keto</th>
                <th className="text-left py-1.5 px-2 font-semibold text-slate-600">Risk</th>
              </tr>
            </thead>
            <tbody>
              {kids.map((kid) => (
                <tr key={kid.id} className="border-b border-slate-100">
                  <td className="py-1.5 px-2 text-slate-800 font-medium">
                    {kid.name} <span className="text-slate-400">({kid.ageMonths}m, {kid.gender === 'male' ? 'M' : 'F'})</span>
                  </td>
                  <td className="py-1.5 px-2 text-slate-600 font-mono">{kid.kidCode}</td>
                  <td className="py-1.5 px-2 text-slate-600">Phase {kid.phase}</td>
                  <td className="py-1.5 px-2 text-slate-600">{kid.parentName}</td>
                  <td className="py-1.5 px-2 text-slate-600">{Math.round(kid.mealCompletionRate * 100)}%</td>
                  <td className="py-1.5 px-2 text-slate-600">{kid.inKetoStatus ? "Yes" : "No"}</td>
                  <td className="py-1.5 px-2 text-slate-600">{kid.isHighRisk ? "High Risk" : "Stable"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PrintLayout>
  );
}

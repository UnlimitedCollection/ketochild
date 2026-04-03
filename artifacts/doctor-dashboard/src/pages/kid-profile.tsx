import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { usePrint } from "@/hooks/usePrint";
import { PrintLayout } from "@/components/print-layout";
import { PrintButton } from "@/components/print-button";
import { PrintFilterDialog, type PrintFilterResult } from "@/components/print-filter-dialog";
import { useParams, Link, useLocation } from "wouter";
import { useGetKid, useAddWeightRecord, useDeleteWeightRecord, useUpdateKidMedical, useUpdateKid, useDeleteKid, useGetKidMealHistory, useGetKidKetoneReadings, useAddKetoneReading, useDeleteKetoneReading, useGetKidMealLogs, useAddMealLog, useDeleteMealLog, useGetKidMealLog, useGetKidAssignedMealPlan, useAssignKidMealPlan, useGetLibraryMealPlans, useGetFoods, useUpdateMealLogImage, getGetKidAssignedMealPlanQueryKey, useListMealTypes, useGetKidMealPlanHistory, getGetKidMealPlanHistoryQueryKey, type LibraryMealPlanDetail, type LibraryMealPlanItem, type MedicalSettingsRequest, type UpdateKidRequest, type MealPlanAssignmentHistory } from "@workspace/api-client-react";
import { useUpload } from "@workspace/object-storage-web";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, startOfMonth, subMonths, eachDayOfInterval, endOfMonth, getDay } from "date-fns";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Legend, Cell
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useCanWrite } from "@/hooks/useRole";
import { Activity, User, Scale, Calendar, FileText, Trash2, Settings, Plus, Loader2, BarChart2, TrendingUp, Flame, FlaskConical, AlertTriangle, ClipboardList, CheckCircle2, Circle, ChevronDown, ChevronUp, Coffee, Sun, Moon, LayoutGrid, Camera, ImageIcon, X, Pencil, LineChart as LineChartIcon, UtensilsCrossed } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function KidProfilePage() {
  const { id } = useParams();
  const kidId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();
  const { data: profile, isLoading } = useGetKid(kidId);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { printRef, handlePrint, isPrinting, onDataReady, cancelPrint } = usePrint("Patient Report", true);
  const [printFilterOpen, setPrintFilterOpen] = useState(false);
  const [printSections, setPrintSections] = useState<Set<string>>(new Set());
  const [printDateRange, setPrintDateRange] = useState<{ start: string; end: string } | undefined>();

  const PROFILE_PRINT_SECTIONS = useMemo(() => [
    { id: "weight", label: "Weight History", defaultChecked: true },
    { id: "medical", label: "Medical Controls", defaultChecked: true },
    { id: "meals", label: "Meal History", defaultChecked: true },
    { id: "ketone", label: "Ketone Readings", defaultChecked: true },
    { id: "mealplan", label: "Meal Plan", defaultChecked: true },
    { id: "compliance", label: "Compliance Calendar", defaultChecked: true },
  ], []);

  const handlePrintFilterConfirm = useCallback((result: PrintFilterResult) => {
    setPrintSections(new Set(result.selectedIds));
    setPrintDateRange(result.dateRange);
    handlePrint();
  }, [handlePrint]);

  const canWrite = useCanWrite();

  const deleteKidMutation = useDeleteKid({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/kids"] });
        toast({ title: "Patient removed", description: "The patient record has been deleted." });
        setLocation("/kids");
      },
      onError: () => toast({ title: "Failed to delete patient", variant: "destructive" }),
    }
  });

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-20 text-slate-500">Patient not found.</div>;
  }

  const { kid, medical, recentWeights } = profile;

  return (
    <PrintLayout innerRef={printRef} className="space-y-6">
      {/* Edit Kid Dialog */}
      <EditKidDialog kidId={kidId} kid={kid} open={editOpen} onOpenChange={setEditOpen} />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Patient Record</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{kid.name}</strong> and all associated data including weight records, meal logs, ketone readings, and notes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteKidMutation.mutate({ kidId })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteKidMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Patient
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PrintFilterDialog
        open={printFilterOpen}
        onOpenChange={setPrintFilterOpen}
        title="Print Patient Report"
        description="Choose which sections and date range to include in the printed report."
        options={PROFILE_PRINT_SECTIONS}
        showDateRange
        onConfirm={handlePrintFilterConfirm}
      />

      {/* Header Profile Card */}
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 rounded-2xl border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary" />
          <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="h-20 w-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <User className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{kid.name}</h1>
                  <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">{kid.kidCode}</span>
                    <span>{kid.ageMonths} months old</span>
                    <span className="capitalize">{kid.gender}</span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-sm py-1 px-3">
                      {kid.dietType === "classic" ? "Classic Ketogenic" : kid.dietType === "mad" ? "Modified Atkins" : kid.dietType === "mct" ? "MCT Diet" : "Low GI Diet"}{kid.dietSubCategory ? ` (${kid.dietSubCategory})` : ""}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {isPrinting && (
                    <span className="no-print flex items-center gap-1.5 text-xs text-slate-400">
                      Preparing report…
                      <button onClick={cancelPrint} className="text-slate-400 hover:text-slate-600 underline underline-offset-2">Cancel</button>
                    </span>
                  )}
                  <PrintButton onPrint={() => setPrintFilterOpen(true)} />
                  <Button size="sm" variant="outline" className="no-print rounded-lg gap-1.5 text-primary border-primary/30 hover:bg-primary/5" onClick={() => setLocation(`/kids/${kidId}/analytics`)}>
                    <LineChartIcon className="h-3.5 w-3.5" /> Analysis
                  </Button>
                  {canWrite && (
                    <>
                      <Button size="sm" variant="outline" className="no-print rounded-lg gap-1.5" onClick={() => setEditOpen(true)}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" className="no-print rounded-lg gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </>
                  )}
                  {kid.isHighRisk && (
                    <Badge variant="destructive" className="bg-destructive/10 text-destructive border border-destructive/20 text-xs ml-2">
                      High Risk
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border-t border-slate-100 p-4 px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500 font-medium">Parent/Guardian</p>
              <p className="font-semibold text-slate-800">{kid.parentName}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Contact</p>
              <p className="font-semibold text-slate-800">{kid.parentContact}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Current Weight</p>
              <p className="font-semibold text-slate-800">{kid.currentWeight ? `${kid.currentWeight} kg` : '--'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">DOB</p>
              <p className="font-semibold text-slate-800">{format(parseISO(kid.dateOfBirth), 'MMM d, yyyy')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Section — hidden in print (print-section below is shown instead) */}
      <Tabs defaultValue="overview" className="w-full no-print">
        <TabsList className="no-print bg-white border border-slate-200 p-1 rounded-xl h-auto mb-6 flex flex-wrap shadow-sm">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white py-2.5 px-4 flex items-center gap-2 transition-all">
            <Activity className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="medical" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white py-2.5 px-4 flex items-center gap-2 transition-all">
            <Settings className="h-4 w-4" /> Medical Controls
          </TabsTrigger>
          <TabsTrigger value="meals" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white py-2.5 px-4 flex items-center gap-2 transition-all">
            <Calendar className="h-4 w-4" /> Meal History
          </TabsTrigger>
          <TabsTrigger value="ketones" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white py-2.5 px-4 flex items-center gap-2 transition-all">
            <Flame className="h-4 w-4" /> Ketones
          </TabsTrigger>
          <TabsTrigger value="mealplan" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white py-2.5 px-4 flex items-center gap-2 transition-all">
            <ClipboardList className="h-4 w-4" />Meal Plan
          </TabsTrigger>
          <TabsTrigger value="compliance" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white py-2.5 px-4 flex items-center gap-2 transition-all">
            <LayoutGrid className="h-4 w-4" /> Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 rounded-2xl shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">Weight History</CardTitle>
                  <CardDescription>Track patient's weight trajectory over time</CardDescription>
                </div>
                {canWrite && <AddWeightDialog kidId={kidId} />}
              </CardHeader>
              <CardContent className="pt-4">
                {recentWeights.length < 2 ? (
                  <div className="h-[300px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                    <Scale className="h-8 w-8 mb-2 opacity-50" />
                    <p>Not enough weight data to display chart.</p>
                  </div>
                ) : (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[...recentWeights].reverse()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                          stroke="#94a3b8"
                          fontSize={12}
                          tickMargin={10}
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontSize={12}
                          tickMargin={10}
                          domain={['dataMin - 1', 'dataMax + 1']}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          labelFormatter={(date) => format(parseISO(date as string), 'MMM d, yyyy')}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#0ea5e9" 
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 2, stroke: "#fff" }}
                          activeDot={{ r: 6, fill: "#0d9488", strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {recentWeights.length > 0 && (
                  <WeightReadingsList kidId={kidId} weights={recentWeights} canWrite={canWrite} />
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Latest Meal Completion</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Today</span>
                        <span className="font-bold text-slate-800">{Math.round(kid.mealCompletionRate * 100)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all" 
                          style={{ width: `${Math.round(kid.mealCompletionRate * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="focus-visible:outline-none">
          <MedicalSettingsForm kidId={kidId} initialData={medical} />
        </TabsContent>

        <TabsContent value="meals" className="focus-visible:outline-none">
          <MealHistoryTab kidId={kidId} medical={medical} />
        </TabsContent>

        <TabsContent value="ketones" className="focus-visible:outline-none">
          <KetoneTab kidId={kidId} />
        </TabsContent>

        <TabsContent value="mealplan" className="focus-visible:outline-none">
          <MealPlanTab kidId={kidId} />
        </TabsContent>

        <TabsContent value="compliance" className="focus-visible:outline-none">
          <ComplianceTab kidId={kidId} />
        </TabsContent>
      </Tabs>

      {isPrinting && (
        <div className="hidden print-section space-y-6">
          {printDateRange && (printDateRange.start || printDateRange.end) && (
            <p className="text-xs text-slate-500 italic">
              Date range: {printDateRange.start || "—"} to {printDateRange.end || "—"}
            </p>
          )}
          {printSections.has("weight") && (
            <>
              <hr className="border-slate-300 my-4" />
              <h2 className="text-lg font-bold text-slate-800">Weight History</h2>
              {(() => {
                const filtered = printDateRange ? recentWeights.filter((w) => {
                  if (printDateRange.start && w.date < printDateRange.start) return false;
                  if (printDateRange.end && w.date > printDateRange.end) return false;
                  return true;
                }) : recentWeights;
                return filtered.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No weight records.</p>
                ) : (
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left py-1.5 px-3 font-semibold text-slate-600">Date</th>
                        <th className="text-right py-1.5 px-3 font-semibold text-slate-600">Weight (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...filtered].reverse().map((w, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-1.5 px-3 text-slate-700">{w.date}</td>
                          <td className="py-1.5 px-3 text-right text-slate-700">{w.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </>
          )}
          {printSections.has("medical") && (
            <>
              <hr className="border-slate-300 my-4" />
              <h2 className="text-lg font-bold text-slate-800">Medical Controls</h2>
              <MedicalSummaryPrint data={medical} />
            </>
          )}
          {printSections.has("meals") && (
            <>
              <hr className="border-slate-300 my-4" />
              <h2 className="text-lg font-bold text-slate-800">Meal History</h2>
              <MealHistoryTab kidId={kidId} medical={medical} />
            </>
          )}
          {printSections.has("ketone") && (
            <>
              <hr className="border-slate-300 my-4" />
              <h2 className="text-lg font-bold text-slate-800">Ketone Readings</h2>
              <KetoneTab kidId={kidId} />
            </>
          )}
          {printSections.has("mealplan") && (
            <>
              <hr className="border-slate-300 my-4" />
              <h2 className="text-lg font-bold text-slate-800">Assigned Meal Plan</h2>
              <MealPlanPrintSection kidId={kidId} />
            </>
          )}
          {printSections.has("compliance") && (
            <>
              <hr className="border-slate-300 my-4" />
              <h2 className="text-lg font-bold text-slate-800">Compliance Calendar</h2>
              <ComplianceTab kidId={kidId} />
            </>
          )}
          <PrintReadySignal kidId={kidId} onReady={onDataReady} />
        </div>
      )}
    </PrintLayout>
  );
}

/**
 * Read-only medical settings summary for print output.
 * Replaces MedicalSettingsForm which uses hidden interactive controls.
 */
function MedicalSummaryPrint({ data }: { data: MedicalSettings }) {
  const rows: { label: string; value: string }[] = [
    { label: "Diet Type", value: data.dietType === "classic" ? `Classic Ketogenic${data.dietSubCategory ? ` (${data.dietSubCategory})` : ""}` : data.dietType === "mad" ? "Modified Atkins" : data.dietType === "mct" ? "MCT Diet" : "Low GI Diet" },
    { label: "Keto Ratio", value: `${data.ketoRatio}:1` },
    { label: "Daily Calories", value: `${data.dailyCalories} kcal` },
    { label: "Daily Carbs", value: `${data.dailyCarbs} g` },
    { label: "Daily Fat", value: `${data.dailyFat} g` },
    { label: "Daily Protein", value: `${data.dailyProtein} g` },
    { label: "Show All Foods", value: data.showAllFoods ? "Yes" : "No" },
    { label: "Show All Recipes", value: data.showAllRecipes ? "Yes" : "No" },
  ];
  return (
    <table className="w-full text-sm border-collapse">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-slate-100">
            <td className="py-1.5 px-3 font-semibold text-slate-600 w-40">{row.label}</td>
            <td className="py-1.5 px-3 text-slate-800">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Mounts inside the print-only section. Watches global query fetch count and
 * signals readiness once all in-flight queries have settled.
 */
function PrintReadySignal({ kidId, onReady }: { kidId: number; onReady: (status: "loading" | "ready" | "error", msg?: string) => void }) {
  // Explicitly track loading AND error state of all queries used in the print section.
  // Includes useListMealTypes because MealPlanPrintSection depends on it for meal-type labels.
  const { isLoading: kidLoading, isError: kidError } = useGetKid(kidId);
  const { isLoading: mealHistoryLoading, isError: mealHistoryError } = useGetKidMealHistory(kidId);
  const { isLoading: ketoneLoading, isError: ketoneError } = useGetKidKetoneReadings(kidId);
  const { isLoading: assignedPlanLoading, isError: assignedPlanError } = useGetKidAssignedMealPlan(kidId);
  const { isLoading: mealTypesLoading, isError: mealTypesError } = useListMealTypes();

  const isLoading = kidLoading || mealHistoryLoading || ketoneLoading || assignedPlanLoading || mealTypesLoading;
  const hasError = kidError || mealHistoryError || ketoneError || assignedPlanError || mealTypesError;

  const signaled = useRef(false);

  useEffect(() => {
    if (signaled.current) return;
    if (!isLoading) {
      signaled.current = true;
      if (hasError) {
        onReady("error", "Some report sections could not be loaded. The report may be incomplete.");
      } else {
        onReady("ready");
      }
    }
  }, [isLoading, hasError, onReady]);

  return null;
}

// Sub-components

type KidData = {
  name: string;
  dateOfBirth: string;
  gender?: string;
  parentName: string;
  parentContact: string;
  dietType: string;
  dietSubCategory?: string | null;
};

const DIET_TYPE_OPTIONS = [
  { value: "classic", label: "Classic Ketogenic Diet" },
  { value: "mad", label: "Modified Atkins Diet" },
  { value: "mct", label: "MCT Diet" },
  { value: "lowgi", label: "Low GI Diet" },
];

const RATIO_OPTIONS = ["2:1", "2.5:1", "3:1", "3.5:1", "4:1"];

const editKidSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female"]),
  parentName: z.string().min(1, "Parent name is required"),
  parentContact: z.string().min(1, "Contact is required"),
  dietType: z.enum(["classic", "mad", "mct", "lowgi"]),
  dietSubCategory: z.string().optional(),
});

function EditKidDialog({ kidId, kid, open, onOpenChange }: { kidId: number; kid: KidData; open: boolean; onOpenChange: (v: boolean) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof editKidSchema>>({
    resolver: zodResolver(editKidSchema),
    defaultValues: {
      name: kid.name,
      dateOfBirth: kid.dateOfBirth,
      gender: (kid.gender ?? "male") as "male" | "female",
      parentName: kid.parentName,
      parentContact: kid.parentContact,
      dietType: (kid.dietType ?? "classic") as "classic" | "mad" | "mct" | "lowgi",
      dietSubCategory: kid.dietSubCategory ?? undefined,
    },
  });

  const selectedDietType = useWatch({ control: form.control, name: "dietType" });

  useEffect(() => {
    if (open) {
      form.reset({
        name: kid.name,
        dateOfBirth: kid.dateOfBirth,
        gender: (kid.gender ?? "male") as "male" | "female",
        parentName: kid.parentName,
        parentContact: kid.parentContact,
        dietType: (kid.dietType ?? "classic") as "classic" | "mad" | "mct" | "lowgi",
        dietSubCategory: kid.dietSubCategory ?? undefined,
      });
    }
  }, [open, kid]);

  const mutation = useUpdateKid({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/kids/${kidId}`] });
        queryClient.invalidateQueries({ queryKey: ["/api/kids"] });
        onOpenChange(false);
        toast({ title: "Patient updated", description: "Patient information has been saved." });
      },
      onError: () => toast({ title: "Failed to update patient", variant: "destructive" }),
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Patient Information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate({ kidId, data: d as UpdateKidRequest }))} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl><Input type="date" className="rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dietType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Diet Type</FormLabel>
                  <Select onValueChange={(v) => { field.onChange(v); if (v !== "classic") form.setValue("dietSubCategory", undefined); }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DIET_TYPE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              {selectedDietType === "classic" && (
                <FormField control={form.control} name="dietSubCategory" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keto Ratio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "4:1"}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RATIO_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <FormField control={form.control} name="parentName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Name</FormLabel>
                  <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="parentContact" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Parent Contact</FormLabel>
                  <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" disabled={mutation.isPending} className="rounded-xl px-8 shadow-md">
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const weightSchema = z.object({
  weight: z.coerce.number().positive("Weight must be positive"),
  date: z.string(),
  note: z.string().optional(),
});

function AddWeightDialog({ kidId }: { kidId: number }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof weightSchema>>({
    resolver: zodResolver(weightSchema),
    defaultValues: {
      weight: undefined,
      date: format(new Date(), 'yyyy-MM-dd'),
      note: ""
    }
  });

  const mutation = useAddWeightRecord({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/kids/${kidId}`] });
        setOpen(false);
        form.reset();
        toast({ title: "Success", description: "Weight record added." });
      }
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90 text-white shadow-sm hover-elevate">
          <Plus className="h-4 w-4 mr-1" /> Add Reading
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add Weight Reading</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate({ kidId, data: d }))} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="weight" render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="0.0" className="rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" className="rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="note" render={({ field }) => (
              <FormItem>
                <FormLabel>Clinical Note (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any observations..." className="resize-none rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={mutation.isPending} className="rounded-xl px-8 shadow-md">
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Reading
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function WeightReadingsList({ kidId, weights, canWrite }: { kidId: number; weights: Array<{ id: number; weight: number; date: string; note?: string | null }>; canWrite: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const deleteWeight = useDeleteWeightRecord();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  async function onDelete(id: number) {
    try {
      await deleteWeight.mutateAsync({ kidId, recordId: id });
      queryClient.invalidateQueries({ queryKey: [`/api/kids/${kidId}`] });
      toast({ title: "Weight record deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    } finally {
      setConfirmId(null);
    }
  }

  return (
    <>
      <div className="mt-4 max-h-[200px] overflow-y-auto rounded-xl border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Weight</TableHead>
              <TableHead className="text-xs">Note</TableHead>
              {canWrite && <TableHead className="text-xs w-10"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {weights.map((w) => (
              <TableRow key={w.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="text-sm text-slate-800">{format(parseISO(w.date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-sm font-bold text-slate-900">{w.weight} <span className="text-xs text-slate-400 font-normal">kg</span></TableCell>
                <TableCell className="text-sm text-slate-500">{w.note || "—"}</TableCell>
                {canWrite && (
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-destructive" onClick={() => setConfirmId(w.id)} disabled={deleteWeight.isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={confirmId !== null} onOpenChange={(open) => { if (!open) setConfirmId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete weight record?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this weight reading. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmId && onDelete(confirmId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const medicalSchema = z.object({
  dietType: z.enum(["classic", "mad", "mct", "lowgi"]),
  dietSubCategory: z.string().optional(),
  ketoRatio: z.coerce.number().positive(),
  dailyCalories: z.coerce.number().min(0).max(3000),
  dailyCarbs: z.coerce.number().min(0),
  dailyFat: z.coerce.number().min(0),
  dailyProtein: z.coerce.number().min(0),
  showAllFoods: z.boolean(),
  showAllRecipes: z.boolean(),
});

type MedicalSettings = {
  dietType: string;
  dietSubCategory?: string | null;
  ketoRatio: number;
  dailyCalories: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyProtein: number;
  showAllFoods: boolean;
  showAllRecipes: boolean;
};

function MedicalSettingsForm({ kidId, initialData }: { kidId: number, initialData: MedicalSettings }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const canWrite = useCanWrite();
  
  const form = useForm<z.infer<typeof medicalSchema>>({
    resolver: zodResolver(medicalSchema),
    defaultValues: {
      dietType: (initialData.dietType ?? "classic") as "classic" | "mad" | "mct" | "lowgi",
      dietSubCategory: initialData.dietSubCategory ?? undefined,
      ketoRatio: initialData.ketoRatio,
      dailyCalories: initialData.dailyCalories,
      dailyCarbs: initialData.dailyCarbs,
      dailyFat: initialData.dailyFat,
      dailyProtein: initialData.dailyProtein,
      showAllFoods: initialData.showAllFoods,
      showAllRecipes: initialData.showAllRecipes,
    }
  });

  const watchedFat     = useWatch({ control: form.control, name: "dailyFat" });
  const watchedProtein = useWatch({ control: form.control, name: "dailyProtein" });
  const watchedCarbs   = useWatch({ control: form.control, name: "dailyCarbs" });

  const calculatedRatio = useMemo(() => {
    const f = Number(watchedFat) || 0;
    const p = Number(watchedProtein) || 0;
    const c = Number(watchedCarbs) || 0;
    const denominator = p * 4 + c * 4;
    if (denominator === 0) return null;
    return ((f * 9) / denominator).toFixed(2);
  }, [watchedFat, watchedProtein, watchedCarbs]);

  const mutation = useUpdateKidMedical({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/kids/${kidId}`] });
        toast({ title: "Settings Saved", description: "Medical controls updated successfully." });
      }
    }
  });

  return (
    <Card className="rounded-2xl shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 rounded-t-2xl pb-4">
        <CardTitle className="text-lg">Dietary Prescriptions</CardTitle>
        <CardDescription>Configure macros and app visibility for this patient.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate({ kidId, data: d as MedicalSettingsRequest }))} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Macros */}
              <div className="space-y-5">
                <h3 className="font-semibold text-slate-900 border-b pb-2">Macros & Targets</h3>
                
                <FormField control={form.control} name="dietType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diet Type</FormLabel>
                    <Select onValueChange={(v) => { field.onChange(v); if (v !== "classic") form.setValue("dietSubCategory", undefined); }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select diet type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DIET_TYPE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {form.watch("dietType") === "classic" && (
                  <FormField control={form.control} name="dietSubCategory" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keto Ratio Sub-Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "4:1"}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select ratio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RATIO_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}

                <FormField control={form.control} name="ketoRatio" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keto Ratio (e.g. 3.0 = 3:1)</FormLabel>
                    <FormControl><Input type="number" step="0.1" className="rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Macro Sliders */}
                <div className="space-y-5 pt-2">
                  <FormField control={form.control} name="dailyCalories" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-1">
                        <FormLabel className="text-sm font-medium text-slate-700">Daily Calories</FormLabel>
                        <span className="text-sm font-bold text-primary tabular-nums">{Number(field.value) || 0} kcal</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0} max={3000} step={10}
                          value={[Number(field.value) || 0]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-1"
                        />
                      </FormControl>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>0 kcal</span><span>3000 kcal</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="dailyFat" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-1">
                        <FormLabel className="text-sm font-medium text-slate-700">Daily Fat</FormLabel>
                        <span className="text-sm font-bold text-primary tabular-nums">{Number(field.value) || 0} g</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0} max={300} step={1}
                          value={[Number(field.value) || 0]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-1"
                        />
                      </FormControl>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>0 g</span><span>300 g</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="dailyProtein" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-1">
                        <FormLabel className="text-sm font-medium text-slate-700">Daily Protein</FormLabel>
                        <span className="text-sm font-bold text-primary tabular-nums">{Number(field.value) || 0} g</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0} max={150} step={1}
                          value={[Number(field.value) || 0]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-1"
                        />
                      </FormControl>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>0 g</span><span>150 g</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="dailyCarbs" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-1">
                        <FormLabel className="text-sm font-medium text-slate-700">Daily Carbs</FormLabel>
                        <span className="text-sm font-bold text-primary tabular-nums">{Number(field.value) || 0} g</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0} max={50} step={1}
                          value={[Number(field.value) || 0]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-1"
                        />
                      </FormControl>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>0 g</span><span>50 g</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Live Keto Ratio Calculator */}
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Calculated Keto Ratio</p>
                  <p className="text-2xl font-black text-blue-900 tabular-nums">
                    {calculatedRatio !== null ? `${calculatedRatio}:1` : "—"}
                  </p>
                  <p className="text-[11px] text-blue-500 mt-0.5">
                    (fat × 9) ÷ (protein × 4 + carbs × 4) based on macros above
                  </p>
                </div>
              </div>

              {/* Visibility */}
              <div className="space-y-5">
                <h3 className="font-semibold text-slate-900 border-b pb-2">Patient App Visibility</h3>
                <p className="text-sm text-slate-500">Control what content the parent can access in their application.</p>
                
                <FormField control={form.control} name="showAllFoods" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-200 p-4 bg-slate-50 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold text-slate-800">Show All Foods</FormLabel>
                      <CardDescription>Allow parent to see foods outside prescribed diet.</CardDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="showAllRecipes" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-200 p-4 bg-slate-50 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold text-slate-800">Show All Recipes</FormLabel>
                      <CardDescription>Allow parent to see recipes outside prescribed diet.</CardDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
            </div>

            {canWrite && (
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button type="submit" disabled={mutation.isPending} className="rounded-xl px-8 shadow-md">
                  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Medical Controls
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const KETONE_LOW = 0.5;
const KETONE_THERAPEUTIC_LOW = 1.5;
const KETONE_THERAPEUTIC_HIGH = 6.0;
const KETONE_HIGH = 8.0;

function getKetoneStatus(value: number): { label: string; color: string; bg: string } {
  if (value < KETONE_LOW) return { label: "Below Range", color: "text-slate-500", bg: "bg-slate-100" };
  if (value < KETONE_THERAPEUTIC_LOW) return { label: "Sub-therapeutic", color: "text-orange-600", bg: "bg-orange-50" };
  if (value <= KETONE_THERAPEUTIC_HIGH) return { label: "Therapeutic", color: "text-emerald-700", bg: "bg-emerald-50" };
  if (value <= KETONE_HIGH) return { label: "High", color: "text-amber-700", bg: "bg-amber-50" };
  return { label: "Dangerously High", color: "text-red-700", bg: "bg-red-50" };
}

const ketoneFormSchema = z.object({
  value: z.coerce.number().min(0).max(30),
  date: z.string().min(1, "Date required"),
  readingType: z.enum(["blood", "urine"]),
  notes: z.string().optional(),
});

function KetoneTab({ kidId }: { kidId: number }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const canWrite = useCanWrite();
  const { data: readings, isLoading } = useGetKidKetoneReadings(kidId);
  const addReading = useAddKetoneReading();
  const deleteReading = useDeleteKetoneReading();

  const form = useForm({
    resolver: zodResolver(ketoneFormSchema),
    defaultValues: {
      value: "" as unknown as number,
      date: new Date().toISOString().split("T")[0],
      readingType: "blood" as const,
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ketoneFormSchema>) {
    try {
      await addReading.mutateAsync({ kidId, data: { value: values.value, date: values.date, readingType: values.readingType, notes: values.notes || undefined } });
      queryClient.invalidateQueries({ queryKey: [`/api/kids/${kidId}/ketones`] });
      toast({ title: "Ketone reading added" });
      form.reset({ value: "" as unknown as number, date: new Date().toISOString().split("T")[0], readingType: "blood", notes: "" });
    } catch {
      toast({ title: "Failed to add reading", variant: "destructive" });
    }
  }

  async function onDelete(id: number) {
    try {
      await deleteReading.mutateAsync({ kidId, readingId: id });
      queryClient.invalidateQueries({ queryKey: [`/api/kids/${kidId}/ketones`] });
      toast({ title: "Reading deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  }

  const chartData = readings ? [...readings].reverse().map(r => ({
    date: format(parseISO(r.date), 'MMM d'),
    value: r.value,
    type: r.readingType,
  })) : [];

  const latest = readings?.[0];

  return (
    <div className="space-y-6">
      {/* Status + Latest Reading */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Flame className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Latest</div>
                {latest ? (
                  <>
                    <div className="text-2xl font-bold text-slate-900">{latest.value} <span className="text-sm font-normal text-slate-500">{latest.unit}</span></div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${getKetoneStatus(latest.value).bg} ${getKetoneStatus(latest.value).color}`}>
                      {getKetoneStatus(latest.value).label}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-slate-400 mt-1">No readings yet</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <FlaskConical className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Therapeutic Range</div>
                <div className="text-xl font-bold text-slate-800">1.5 – 6.0 <span className="text-sm font-normal text-slate-500">mmol/L</span></div>
                <div className="text-xs text-slate-400">Blood ketone target</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total Readings</div>
                <div className="text-2xl font-bold text-slate-900">{readings?.length ?? 0}</div>
                {readings && readings.filter(r => r.value > KETONE_HIGH).length > 0 && (
                  <div className="text-xs font-semibold text-red-600">{readings.filter(r => r.value > KETONE_HIGH).length} dangerously high</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm bg-white">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base">Ketone Trend</CardTitle>
            <CardDescription>Blood/urine ketone readings over time (mmol/L)</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {chartData.length < 2 ? (
              <div className="h-48 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                <p>Add at least 2 readings to see the trend chart.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" tickLine={false} domain={[0, 'dataMax + 1']} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(val: number) => [`${val} mmol/L`, "Ketones"]}
                  />
                  <ReferenceLine y={KETONE_THERAPEUTIC_LOW} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: 'Min', position: 'right', fontSize: 9 }} />
                  <ReferenceLine y={KETONE_THERAPEUTIC_HIGH} stroke="#ef4444" strokeDasharray="4 3" label={{ value: 'Max', position: 'right', fontSize: 9 }} />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Add Reading Form */}
        {canWrite && (
          <Card className="rounded-2xl border-slate-200 shadow-sm bg-white">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Plus className="h-4 w-4" /> Log Reading</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="value" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (mmol/L)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="e.g. 2.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="readingType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="blood">Blood</SelectItem>
                        <SelectItem value="urine">Urine</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes <span className="text-slate-400 font-normal">(optional)</span></FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g. morning reading, fasting" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={addReading.isPending}>
                  {addReading.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Log Reading
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        )}
      </div>

      {/* Readings Table */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-3">
          <CardTitle className="text-base">Reading History</CardTitle>
        </CardHeader>
        {isLoading ? (
          <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600">Date</TableHead>
                  <TableHead className="font-semibold text-slate-600">Value</TableHead>
                  <TableHead className="font-semibold text-slate-600">Type</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  <TableHead className="font-semibold text-slate-600">Notes</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!readings || readings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">No ketone readings recorded.</TableCell>
                  </TableRow>
                ) : readings.map((r) => {
                  const status = getKetoneStatus(r.value);
                  return (
                    <TableRow key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-800">{format(parseISO(r.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="font-bold text-slate-900">{r.value} <span className="text-xs text-slate-400 font-normal">{r.unit}</span></TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-slate-600">{r.readingType}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{r.notes || "—"}</TableCell>
                      <TableCell>
                        {canWrite && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-destructive" onClick={() => onDelete(r.id)} disabled={deleteReading.isPending}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}

type MedicalData = {
  dailyCalories?: number;
  dailyCarbs?: number;
  dailyFat?: number;
  dailyProtein?: number;
};

const KNOWN_MEAL_LABELS: Record<string, { icon: string }> = {
  breakfast: { icon: "🌅" },
  lunch: { icon: "☀️" },
  dinner: { icon: "🌙" },
};

function getMealLabel(name: string) {
  return KNOWN_MEAL_LABELS[name.toLowerCase()] ?? { icon: "🍽️" };
}

function MealPhotoUpload({ kidId, log }: { kidId: number; log: { id: number; imageUrl?: string | null } }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const updateImage = useUpdateMealLogImage();
  const { uploadFile, isUploading } = useUpload({
    onSuccess: async (response) => {
      await updateImage.mutateAsync({ kidId, logId: log.id, data: { imageUrl: response.objectPath } });
      queryClient.invalidateQueries({ queryKey: [`/api/kids/${kidId}/meal-logs`] });
      toast({ title: "Photo attached" });
    },
    onError: () => {
      toast({ title: "Upload failed", variant: "destructive" });
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  async function handleRemove() {
    await updateImage.mutateAsync({ kidId, logId: log.id, data: { imageUrl: null } });
    queryClient.invalidateQueries({ queryKey: [`/api/kids/${kidId}/meal-logs`] });
    toast({ title: "Photo removed" });
  }

  const isBusy = isUploading || updateImage.isPending;

  return (
    <div className="flex items-center gap-2 mt-1">
      {log.imageUrl ? (
        <>
          <a href={`/api/storage${log.imageUrl}`} target="_blank" rel="noopener noreferrer">
            <img
              src={`/api/storage${log.imageUrl}`}
              alt="meal photo"
              className="h-10 w-10 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-destructive"
            disabled={isBusy}
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </>
      ) : null}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-slate-400 hover:text-primary gap-1 px-2"
        disabled={isBusy}
        onClick={() => fileRef.current?.click()}
      >
        {isBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
        {log.imageUrl ? "Change" : "Add Photo"}
      </Button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}

function MealDayDetailDialog({ kidId, date, onClose }: { kidId: number; date: string; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const canWrite = useCanWrite();
  const { data: logs, isLoading } = useGetKidMealLogs(kidId, { date });
  const { data: mealTypesData } = useListMealTypes();
  const mealTypeNames = useMemo(() => (mealTypesData ?? []).map((mt) => mt.name), [mealTypesData]);
  const addLog = useAddMealLog();
  const deleteLog = useDeleteMealLog();
  const [mealType, setMealType] = useState("");
  const [isCompleted, setIsCompleted] = useState(true);
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [protein, setProtein] = useState("");
  const [notes, setNotes] = useState("");

  async function handleAdd() {
    try {
      await addLog.mutateAsync({ kidId, data: {
        date,
        mealType,
        isCompleted,
        calories: calories ? parseFloat(calories) : undefined,
        carbs: carbs ? parseFloat(carbs) : undefined,
        fat: fat ? parseFloat(fat) : undefined,
        protein: protein ? parseFloat(protein) : undefined,
        notes: notes || undefined,
      }});
      queryClient.invalidateQueries({ queryKey: [`/api/kids/${kidId}/meal-logs`] });
      toast({ title: "Meal logged" });
      setCalories(""); setCarbs(""); setFat(""); setProtein(""); setNotes("");
    } catch {
      toast({ title: "Failed to add", variant: "destructive" });
    }
  }

  async function handleDelete(logId: number) {
    try {
      await deleteLog.mutateAsync({ kidId, logId });
      queryClient.invalidateQueries({ queryKey: [`/api/kids/${kidId}/meal-logs`] });
      toast({ title: "Meal log deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  }

  const displayDate = date ? format(parseISO(date), 'EEEE, MMM d, yyyy') : "";

  return (
    <Dialog open={true} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Meal Breakdown — {displayDate}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Existing logs */}
          {isLoading ? (
            <div className="py-4 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" /></div>
          ) : (
            <div className="space-y-2">
              {mealTypeNames.map((typeName) => {
                const entry = logs?.find(l => l.mealType.toLowerCase() === typeName.toLowerCase());
                const meta = getMealLabel(typeName);
                return (
                  <div key={typeName} className={`p-3 rounded-xl border ${entry ? (entry.isCompleted ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{meta.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-slate-800">{typeName}</span>
                          {entry ? (
                            <Badge className={`text-xs ${entry.isCompleted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {entry.isCompleted ? '✓ Completed' : '✗ Missed'}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-slate-400">Not logged</Badge>
                          )}
                        </div>
                        {entry && (entry.calories || entry.carbs || entry.fat || entry.protein) ? (
                          <div className="text-xs text-slate-500 mt-0.5">
                            {entry.calories ? `${Math.round(entry.calories)} kcal` : ''}
                            {entry.fat ? ` · F: ${Math.round(entry.fat)}g` : ''}
                            {entry.protein ? ` · P: ${Math.round(entry.protein)}g` : ''}
                            {entry.carbs ? ` · C: ${Math.round(entry.carbs)}g` : ''}
                          </div>
                        ) : null}
                        {entry?.notes && <div className="text-xs text-slate-400 mt-0.5 italic">{entry.notes}</div>}
                      </div>
                      {entry && canWrite && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-destructive" onClick={() => handleDelete(entry.id)} disabled={deleteLog.isPending}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    {entry && <MealPhotoUpload kidId={kidId} log={entry} />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add meal log form */}
          {canWrite && <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Log a Meal</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Meal Type</label>
                <Select value={mealType || undefined} onValueChange={(v) => setMealType(v)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypeNames.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Status</label>
                <Select value={isCompleted ? "completed" : "missed"} onValueChange={(v) => setIsCompleted(v === "completed")}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Cal</label>
                <Input type="number" placeholder="0" value={calories} onChange={e => setCalories(e.target.value)} className="h-9 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Fat (g)</label>
                <Input type="number" placeholder="0" value={fat} onChange={e => setFat(e.target.value)} className="h-9 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Protein (g)</label>
                <Input type="number" placeholder="0" value={protein} onChange={e => setProtein(e.target.value)} className="h-9 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Carbs (g)</label>
                <Input type="number" placeholder="0" value={carbs} onChange={e => setCarbs(e.target.value)} className="h-9 text-sm" />
              </div>
            </div>
            <Input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} className="mb-3 h-9 text-sm" />
            <Button onClick={handleAdd} className="w-full" size="sm" disabled={addLog.isPending}>
              {addLog.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Save Meal Log
            </Button>
          </div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const KNOWN_SLOT_STYLES: Record<string, { icon: string; color: string }> = {
  breakfast: { icon: "🌅", color: "text-amber-700 bg-amber-50 border-amber-200" },
  lunch: { icon: "☀️", color: "text-blue-700 bg-blue-50 border-blue-200" },
  dinner: { icon: "🌙", color: "text-violet-700 bg-violet-50 border-violet-200" },
};
const DEFAULT_SLOT_STYLE = { icon: "🍽️", color: "text-slate-700 bg-slate-50 border-slate-200" };

function getSlotStyle(name: string) {
  return KNOWN_SLOT_STYLES[name.toLowerCase()] ?? DEFAULT_SLOT_STYLE;
}

function MealDayAccordion({ kidId, date, onManage }: { kidId: number; date: string; onManage: () => void }) {
  const { data, isLoading } = useGetKidMealLog(kidId, { date });
  const { data: mealLogs } = useGetKidMealLogs(kidId, { date });
  const { data: mealTypesData } = useListMealTypes();
  const mealTypeNames = useMemo(() => (mealTypesData ?? []).map((mt) => mt.name), [mealTypesData]);

  if (isLoading) {
    return (
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-center justify-center py-6 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading food entries...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 pt-1 bg-slate-50/60 border-t border-slate-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {mealTypeNames.map((typeName) => {
          const { icon, color } = getSlotStyle(typeName);
          const foods = data?.meals?.[typeName.toLowerCase()] ?? data?.meals?.[typeName] ?? [];
          const slotCalories = foods.reduce((s: number, f: any) => s + (f.calories ?? 0), 0);
          const logEntry = mealLogs?.find(l => l.mealType.toLowerCase() === typeName.toLowerCase());
          const imageUrl = logEntry?.imageUrl;
          return (
            <div key={typeName} className={`rounded-xl border p-3 ${color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm flex items-center gap-1.5">
                  <span>{icon}</span> {typeName}
                </span>
                <div className="flex items-center gap-2">
                  {imageUrl && (
                    <a href={`/api/storage${imageUrl}`} target="_blank" rel="noopener noreferrer" title="View meal photo">
                      <img
                        src={`/api/storage${imageUrl}`}
                        alt="meal photo"
                        className="h-8 w-8 object-cover rounded-lg border border-white/50 hover:opacity-80 transition-opacity cursor-pointer shadow-sm"
                      />
                    </a>
                  )}
                  {foods.length > 0 && (
                    <span className="text-xs font-mono opacity-75">{Math.round(slotCalories)} kcal</span>
                  )}
                </div>
              </div>
              {foods.length === 0 ? (
                <p className="text-xs opacity-60 italic">Not logged</p>
              ) : (
                <ul className="space-y-1.5">
                  {foods.map((food) => (
                    <li key={food.id} className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{food.foodName}</span>
                        <span className="opacity-70 ml-2 shrink-0">{food.quantity}{food.unit}</span>
                      </div>
                      <div className="opacity-60 font-mono mt-0.5">
                        {Math.round(food.calories ?? 0)} kcal · F {Math.round(food.fat ?? 0)}g · P {Math.round(food.protein ?? 0)}g · C {Math.round(food.carbs ?? 0)}g
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-end">
        <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-primary h-7 px-2" onClick={onManage}>
          Manage Completion Records
        </Button>
      </div>
    </div>
  );
}

function MealHistoryTab({ kidId, medical }: { kidId: number; medical: MedicalData }) {
  const { data: rawHistory, isLoading } = useGetKidMealHistory(kidId);
  const [chartView, setChartView] = useState<"7d" | "30d">("7d");
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [detailDate, setDetailDate] = useState<string | null>(null);

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>;

  // History from API is newest-first; reverse for chronological chart display
  const chronological = rawHistory ? [...rawHistory].reverse() : [];
  const chartData = chartView === "7d" ? chronological.slice(-7) : chronological.slice(-30);

  const chartDataFormatted = chartData.map(d => ({
    date: format(parseISO(d.date), 'MMM d'),
    calories: Math.round(d.totalCalories ?? 0),
    carbs: Math.round(d.totalCarbs ?? 0),
    fat: Math.round(d.totalFat ?? 0),
    protein: Math.round(d.totalProtein ?? 0),
  }));

  const targets = {
    calories: medical?.dailyCalories ?? 0,
    carbs: medical?.dailyCarbs ?? 0,
    fat: medical?.dailyFat ?? 0,
    protein: medical?.dailyProtein ?? 0,
  };

  const macroCharts = [
    { key: "calories" as const, label: "Calories", unit: "kcal", color: "#6366f1", target: targets.calories },
    { key: "carbs" as const, label: "Carbs", unit: "g", color: "#f59e0b", target: targets.carbs },
    { key: "fat" as const, label: "Fat", unit: "g", color: "#0ea5e9", target: targets.fat },
    { key: "protein" as const, label: "Protein", unit: "g", color: "#10b981", target: targets.protein },
  ];

  function toggleDay(date: string) {
    setExpandedDate(prev => prev === date ? null : date);
  }

  return (
    <div className="space-y-6">
      {/* Nutrition Charts Section */}
      <Card className="rounded-2xl shadow-sm border-slate-200 bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" /> Nutrition Trends
            </CardTitle>
            <CardDescription>Daily intake vs. prescribed targets (dashed line)</CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <Button
              size="sm"
              variant={chartView === "7d" ? "default" : "ghost"}
              onClick={() => setChartView("7d")}
              className="h-7 px-3 rounded-md text-xs"
            >7 Days</Button>
            <Button
              size="sm"
              variant={chartView === "30d" ? "default" : "ghost"}
              onClick={() => setChartView("30d")}
              className="h-7 px-3 rounded-md text-xs"
            >30 Days</Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {chartDataFormatted.length < 2 ? (
            <div className="h-40 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
              <p>Not enough data to display charts.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {macroCharts.map(({ key, label, unit, color, target }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">{label}</span>
                    <span className="text-xs text-slate-400">Target: <span className="font-semibold text-slate-600">{target}{unit}</span></span>
                  </div>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={chartDataFormatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" tickLine={false} />
                      <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" tickLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        formatter={(val: number) => [`${val}${unit}`, label]}
                      />
                      <Bar dataKey={key} fill={color} radius={[3, 3, 0, 0]} fillOpacity={0.85} />
                      {target > 0 && (
                        <ReferenceLine y={target} stroke={color} strokeDasharray="4 3" strokeWidth={1.5} />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meal History Accordion List */}
      <Card className="rounded-2xl shadow-sm border-slate-200 overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-500" /> Daily Meal Log
          </CardTitle>
          <CardDescription className="text-xs">Click any day to expand per-meal food breakdown</CardDescription>
        </CardHeader>
        <div className="divide-y divide-slate-100">
          {!rawHistory || rawHistory.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">No meal history recorded.</div>
          ) : rawHistory.map((day) => {
            const isExpanded = expandedDate === day.date;
            return (
              <div key={day.date} className="bg-white hover:bg-slate-50/40 transition-colors">
                {/* Row header */}
                <button
                  className="w-full text-left px-4 py-3 flex items-center gap-3 focus:outline-none"
                  onClick={() => toggleDay(day.date)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 items-center text-sm">
                    <div>
                      <div className="font-semibold text-slate-800">{format(parseISO(day.date), 'EEE, MMM d')}</div>
                      <div className="text-xs text-slate-400">{format(parseISO(day.date), 'yyyy')}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${day.completionRate < 0.5 ? 'bg-destructive' : day.completionRate < 0.8 ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.round(day.completionRate * 100)}%` }}
                        />
                      </div>
                      <span className="font-medium text-slate-700">{Math.round(day.completionRate * 100)}%</span>
                    </div>
                    <div className="text-slate-600 hidden md:block">
                      <span className="text-green-600 font-semibold">{day.completedMeals}</span>/{day.totalMeals} meals
                      {day.missedMeals > 0 && <span className="text-destructive ml-1 text-xs">({day.missedMeals} missed)</span>}
                    </div>
                    <div className="text-slate-500 hidden md:block text-xs font-mono">
                      {Math.round(day.totalCalories ?? 0)} kcal · F{Math.round(day.totalFat ?? 0)} P{Math.round(day.totalProtein ?? 0)} C{Math.round(day.totalCarbs ?? 0)}
                    </div>
                  </div>
                  <div className="shrink-0 text-slate-400">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {/* Accordion detail */}
                {isExpanded && (
                  <MealDayAccordion
                    kidId={kidId}
                    date={day.date}
                    onManage={() => setDetailDate(day.date)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {detailDate && <MealDayDetailDialog kidId={kidId} date={detailDate} onClose={() => setDetailDate(null)} />}
    </div>
  );
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getComplianceColor(rate: number | undefined): string {
  if (rate === undefined) return "bg-slate-100";
  if (rate === 0) return "bg-red-400";
  if (rate < 1) return "bg-amber-400";
  return "bg-green-500";
}

function ComplianceCalendarMonth({
  month,
  completionMap,
}: {
  month: Date;
  completionMap: Map<string, number>;
}) {
  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });

  const startDow = getDay(firstDay);
  const leadingBlanks = startDow === 0 ? 6 : startDow - 1;

  return (
    <div>
      <p className="text-sm font-bold text-slate-700 mb-3 text-center">
        {format(month, "MMMM yyyy")}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAY_LABELS.map((d) => (
          <span key={d} className="text-[10px] font-semibold text-slate-400">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const rate = completionMap.get(dateKey);
          const color = getComplianceColor(rate);
          const tooltip =
            rate !== undefined
              ? `${format(day, "MMM d")}: ${(rate * 100).toFixed(1)}%`
              : `${format(day, "MMM d")}: No data`;
          return (
            <div
              key={dateKey}
              title={tooltip}
              className={`aspect-square rounded-sm ${color} cursor-default transition-opacity hover:opacity-80`}
            />
          );
        })}
      </div>
    </div>
  );
}

function ComplianceTab({ kidId }: { kidId: number }) {
  const { data: rawHistory, isLoading } = useGetKidMealHistory(kidId);

  const completionMap = useMemo(() => {
    const map = new Map<string, number>();
    rawHistory?.forEach((d) => map.set(d.date, d.completionRate));
    return map;
  }, [rawHistory]);

  const today = new Date();
  const months = [subMonths(today, 1), today];

  const totalDays = rawHistory?.length ?? 0;
  const fullDays = rawHistory?.filter((d) => d.completionRate === 1).length ?? 0;
  const partialDays = rawHistory?.filter((d) => d.completionRate > 0 && d.completionRate < 1).length ?? 0;
  const missedDays = rawHistory?.filter((d) => d.completionRate === 0).length ?? 0;

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Days Tracked", value: totalDays, color: "text-slate-800",  bg: "bg-slate-50" },
          { label: "Full Compliance", value: fullDays, color: "text-green-700", bg: "bg-green-50" },
          { label: "Partial Days",  value: partialDays, color: "text-amber-700", bg: "bg-amber-50" },
          { label: "Missed Days",   value: missedDays, color: "text-red-700",   bg: "bg-red-50"   },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border border-slate-200 shadow-sm p-4 ${s.bg}`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <Card className="rounded-2xl shadow-sm border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-primary" /> Compliance Heatmap
          </CardTitle>
          <CardDescription>Daily meal completion over the last 2 months. Hover a cell for details.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center gap-4 mb-5 text-xs text-slate-600">
            {[
              { label: "No data",  color: "bg-slate-100" },
              { label: "Missed",   color: "bg-red-400"   },
              { label: "Partial",  color: "bg-amber-400" },
              { label: "Full",     color: "bg-green-500" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-sm ${l.color}`} />
                {l.label}
              </span>
            ))}
          </div>

          {totalDays === 0 && (
            <p className="text-xs text-slate-400 mb-4 italic">No meal data recorded yet. Days appear grey until logs are submitted.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {months.map((month) => (
              <ComplianceCalendarMonth
                key={format(month, "yyyy-MM")}
                month={month}
                completionMap={completionMap}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Meal Plan Tab ─────────────────────────────────────────────────────────────

const KNOWN_PLAN_STYLES: Record<string, { icon: typeof Coffee; color: string }> = {
  breakfast: { icon: Coffee, color: "text-amber-600 bg-amber-50 border-amber-100" },
  lunch: { icon: Sun, color: "text-blue-600 bg-blue-50 border-blue-100" },
  dinner: { icon: Moon, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
};
const DEFAULT_PLAN_STYLE = { icon: UtensilsCrossed, color: "text-slate-600 bg-slate-50 border-slate-100" };

function getPlanStyle(name: string) {
  return KNOWN_PLAN_STYLES[name.toLowerCase()] ?? DEFAULT_PLAN_STYLE;
}

const PLAN_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

function MealPlanAssignmentHistorySection({ history, isLoading }: { history: MealPlanAssignmentHistory[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Assignment History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Assignment History</CardTitle>
          <CardDescription>No meal plan assignments yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const uniquePlanNames = Array.from(new Set(history.map((h) => h.planName ?? "Unassigned")));
  const planColorMap: Record<string, string> = {};
  uniquePlanNames.forEach((name, i) => {
    planColorMap[name] = PLAN_COLORS[i % PLAN_COLORS.length];
  });

  const chronological = [...history].reverse();

  const barChartData = chronological.map((h) => ({
    date: format(parseISO(h.assignedAt), "MMM d, yy"),
    assignedAt: h.assignedAt,
    planName: h.planName ?? "Unassigned",
    duration: Math.max(h.durationDays, 1),
    color: planColorMap[h.planName ?? "Unassigned"],
    isCurrentPeriod: h.isCurrentPeriod,
    doctorName: h.doctorName,
    action: h.action,
  }));

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Assignment History</CardTitle>
        <CardDescription>Visual timeline of meal plan assignments over time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline Bar Chart — dates on X-axis, bar height = duration */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 4, right: 8, bottom: 32, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                height={48}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `${v}d`}
                label={{ value: "Days active", angle: -90, position: "insideLeft", offset: 10, fontSize: 10 }}
                width={44}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs shadow-md space-y-1">
                      <p className="font-semibold text-slate-800">{d.planName}</p>
                      <p className="text-slate-500">From: {format(parseISO(d.assignedAt), "MMM d, yyyy")}</p>
                      <p className="text-slate-500">Duration: {d.isCurrentPeriod ? `${d.duration} days (ongoing)` : `${d.duration} days`}</p>
                      <p className="text-slate-500">Action: <span className="capitalize">{d.action}</span></p>
                      <p className="text-slate-500">By: {d.doctorName}</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="duration" radius={[4, 4, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Color Legend */}
        <div className="flex flex-wrap gap-3">
          {uniquePlanNames.map((name) => (
            <div key={name} className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: planColorMap[name] }} />
              <span className="text-xs text-slate-600 truncate max-w-[120px]">{name}</span>
            </div>
          ))}
        </div>

        {/* History Table — chronological order (oldest first) */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Plan</TableHead>
                <TableHead className="text-xs">Action</TableHead>
                <TableHead className="text-xs text-right">Duration</TableHead>
                <TableHead className="text-xs">Doctor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chronological.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="text-xs whitespace-nowrap">
                    {format(parseISO(h.assignedAt), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-2.5 w-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: planColorMap[h.planName ?? "Unassigned"] }}
                      />
                      <span className="truncate max-w-[140px]">{h.planName ?? <em className="text-slate-400">Unassigned</em>}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs capitalize">
                    <Badge
                      variant="outline"
                      className={
                        h.action === "assigned" ? "border-green-200 text-green-700 bg-green-50" :
                        h.action === "unassigned" ? "border-red-200 text-red-700 bg-red-50" :
                        "border-blue-200 text-blue-700 bg-blue-50"
                      }
                    >
                      {h.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-right whitespace-nowrap">
                    {h.isCurrentPeriod
                      ? <span className="text-primary font-medium">{h.durationDays}d (current)</span>
                      : `${h.durationDays}d`}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">{h.doctorName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function MealPlanTab({ kidId }: { kidId: number }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const canWrite = useCanWrite();
  const { data: mealTypesData } = useListMealTypes();
  const mealTypeNames = useMemo(() => (mealTypesData ?? []).map((mt) => mt.name), [mealTypesData]);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [pendingPlanId, setPendingPlanId] = useState<string>("");

  const { data: rawAssigned, isLoading: assignedLoading } = useGetKidAssignedMealPlan(kidId);
  const { data: libraryPlans, isLoading: libraryLoading } = useGetLibraryMealPlans();
  const { data: mealHistory } = useGetKidMealHistory(kidId);
  const assignPlan = useAssignKidMealPlan();

  // Narrow the void | LibraryMealPlanDetail union to a proper typed variable
  const plan: LibraryMealPlanDetail | undefined =
    rawAssigned && typeof rawAssigned === "object" ? rawAssigned : undefined;

  // Today's actual intake from the meal history (history is newest-first from the API)
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayRecord = mealHistory?.find((d) => d.date === todayStr) ?? null;

  const { data: assignmentHistory, isLoading: historyLoading } = useGetKidMealPlanHistory(kidId);

  function handleAssign(planIdStr: string) {
    const planId = planIdStr === "none" ? null : parseInt(planIdStr, 10);
    setPendingPlanId(planIdStr);
    assignPlan.mutate(
      { kidId, data: { planId } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetKidAssignedMealPlanQueryKey(kidId) });
          queryClient.invalidateQueries({ queryKey: getGetKidMealPlanHistoryQueryKey(kidId) });
          toast({ title: planId ? "Meal plan assigned" : "Meal plan unassigned" });
        },
        onError: () => {
          toast({ title: "Failed to update meal plan", variant: "destructive" });
          setPendingPlanId("");
        },
      }
    );
  }

  const getMealItems = (mealType: string): LibraryMealPlanItem[] =>
    plan?.items?.filter((i: LibraryMealPlanItem) => i.mealType.toLowerCase() === mealType.toLowerCase()) ?? [];

  // Planned daily macro totals from the assigned plan items
  const plannedTotals = (plan?.items ?? []).reduce(
    (acc, item: LibraryMealPlanItem) => ({
      calories: acc.calories + (item.calories ?? 0),
      carbs: acc.carbs + (item.carbs ?? 0),
      fat: acc.fat + (item.fat ?? 0),
      protein: acc.protein + (item.protein ?? 0),
    }),
    { calories: 0, carbs: 0, fat: 0, protein: 0 }
  );

  // Today's actual macro totals from meal history
  const actualTotals = todayRecord
    ? {
        calories: todayRecord.totalCalories ?? 0,
        carbs: todayRecord.totalCarbs ?? 0,
        fat: todayRecord.totalFat ?? 0,
        protein: todayRecord.totalProtein ?? 0,
      }
    : null;

  const currentPlanId = plan?.id;

  return (
    <div className="space-y-4">
      {/* Assignment control */}
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800 mb-1">Assigned Library Plan</p>
              <p className="text-xs text-slate-500">
                Select a plan from your library to assign it to this patient.{" "}
                <Link to="/meal-plans" className="text-primary underline underline-offset-2 hover:opacity-80">
                  Manage plans in the library →
                </Link>
              </p>
            </div>
            {canWrite && (
              <div className="flex items-center gap-2 min-w-[240px]">
                <Select
                  value={assignPlan.isPending ? pendingPlanId : (currentPlanId?.toString() ?? "none")}
                  onValueChange={handleAssign}
                  disabled={assignPlan.isPending || libraryLoading || assignedLoading}
                >
                  <SelectTrigger className="rounded-xl flex-1">
                    <SelectValue placeholder={assignedLoading ? "Loading…" : "No plan assigned"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No plan assigned</SelectItem>
                    {(libraryPlans ?? []).map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentPlanId && !assignPlan.isPending && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl shrink-0 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleAssign("none")}
                    title="Unassign plan"
                  >
                    Unassign
                  </Button>
                )}
                {assignPlan.isPending && <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan detail */}
      {assignedLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : !plan ? (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
            <ClipboardList className="h-10 w-10 opacity-20" />
            <p className="text-sm">No meal plan assigned yet</p>
            <p className="text-xs text-slate-400 text-center max-w-xs">
              Create plans in the Meal Plans library and assign them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Plan header */}
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{plan.name}</CardTitle>
              </div>
              {plan.description && (
                <CardDescription>{plan.description}</CardDescription>
              )}
            </CardHeader>

            {/* Planned vs Actual macro comparison */}
            <CardContent className="pt-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Today's Compliance — {format(new Date(), "MMM d, yyyy")}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-100">
                      <th className="text-left pb-2 font-medium">Macro</th>
                      <th className="text-right pb-2 font-medium">Planned</th>
                      <th className="text-right pb-2 font-medium">Actual (today)</th>
                      <th className="text-right pb-2 font-medium">% of Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(
                      [
                        { label: "Calories", planned: plannedTotals.calories, actual: actualTotals?.calories, unit: "kcal", color: "text-orange-600" },
                        { label: "Carbs", planned: plannedTotals.carbs, actual: actualTotals?.carbs, unit: "g", color: "text-yellow-600" },
                        { label: "Fat", planned: plannedTotals.fat, actual: actualTotals?.fat, unit: "g", color: "text-blue-600" },
                        { label: "Protein", planned: plannedTotals.protein, actual: actualTotals?.protein, unit: "g", color: "text-green-600" },
                      ] as const
                    ).map(({ label, planned, actual, unit, color }) => {
                      const pct = planned > 0 && actual !== undefined ? Math.round((actual / planned) * 100) : null;
                      const pctColor =
                        pct === null ? "text-slate-300" :
                        pct >= 90 && pct <= 110 ? "text-green-600" :
                        pct >= 75 ? "text-yellow-600" : "text-red-500";
                      return (
                        <tr key={label} className="py-2">
                          <td className={`py-2 font-medium ${color}`}>{label}</td>
                          <td className="py-2 text-right text-slate-700">
                            {label === "Calories" ? Math.round(planned) : planned.toFixed(1)} {unit}
                          </td>
                          <td className="py-2 text-right text-slate-700">
                            {actual !== undefined
                              ? `${label === "Calories" ? Math.round(actual) : actual.toFixed(1)} ${unit}`
                              : <span className="text-slate-300 text-xs italic">no data</span>}
                          </td>
                          <td className={`py-2 text-right font-semibold ${pctColor}`}>
                            {pct !== null ? `${pct}%` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {!actualTotals && (
                <p className="text-xs text-slate-400 mt-2 italic">No meal logs recorded today — actual intake will appear once the patient logs meals.</p>
              )}
            </CardContent>
          </Card>

          {/* Meal sections — read-only view */}
          {mealTypeNames.map((mealTypeName) => {
            const { icon: Icon, color } = getPlanStyle(mealTypeName);
            const items = getMealItems(mealTypeName);
            const mealCals = items.reduce((a: number, i: LibraryMealPlanItem) => a + (i.calories ?? 0), 0);
            const isExpanded = expandedMeal === mealTypeName;
            return (
              <Card key={mealTypeName} className="border border-slate-200">
                <CardHeader className="py-3 px-4">
                  <button
                    className="flex items-center gap-3 w-full text-left"
                    onClick={() => setExpandedMeal(isExpanded ? null : mealTypeName)}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 text-sm">{mealTypeName}</p>
                      <p className="text-xs text-slate-400">
                        {items.length} item{items.length !== 1 ? "s" : ""} · {Math.round(mealCals)} kcal
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0 px-4 pb-4">
                    {items.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-3">No foods in this meal</p>
                    ) : (
                      <div className="space-y-2">
                        {items.map((item: LibraryMealPlanItem) => (
                          <div
                            key={item.id}
                            className="flex items-center px-3 py-2 bg-white rounded-lg border border-slate-100"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-800">{item.foodName}</p>
                              <p className="text-xs text-slate-400">
                                {item.portionGrams}{item.unit} · {Math.round(item.calories ?? 0)} kcal ·{" "}
                                C:{(item.carbs ?? 0).toFixed(1)}g · F:{(item.fat ?? 0).toFixed(1)}g · P:{(item.protein ?? 0).toFixed(1)}g
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </>
      )}

      {/* Assignment History — always visible */}
      <MealPlanAssignmentHistorySection history={assignmentHistory ?? []} isLoading={historyLoading} />
    </div>
  );
}

/**
 * Read-only print version of the assigned meal plan.
 * Shows all meal type sections expanded with all items — no interactive buttons.
 */
function MealPlanPrintSection({ kidId }: { kidId: number }) {
  const { data: rawAssigned, isLoading: assignedLoading } = useGetKidAssignedMealPlan(kidId);
  const { data: mealTypesData } = useListMealTypes();
  const mealTypeNames = useMemo(() => (mealTypesData ?? []).map((mt: { name: string }) => mt.name), [mealTypesData]);

  const plan: LibraryMealPlanDetail | undefined =
    rawAssigned && typeof rawAssigned === "object" ? rawAssigned : undefined;

  const getMealItems = (mealType: string): LibraryMealPlanItem[] =>
    plan?.items?.filter((i: LibraryMealPlanItem) => i.mealType.toLowerCase() === mealType.toLowerCase()) ?? [];

  if (assignedLoading) return <p className="text-xs text-slate-400 italic">Loading meal plan…</p>;
  if (!plan) return <p className="text-xs text-slate-400 italic">No meal plan assigned.</p>;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-700">{plan.name}</p>
      {plan.description && <p className="text-xs text-slate-500">{plan.description}</p>}
      {mealTypeNames.map((mealTypeName) => {
        const items = getMealItems(mealTypeName);
        const mealCals = items.reduce((a: number, i: LibraryMealPlanItem) => a + (i.calories ?? 0), 0);
        return (
          <div key={mealTypeName}>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
              {mealTypeName} — {Math.round(mealCals)} kcal
            </p>
            {items.length === 0 ? (
              <p className="text-xs text-slate-400 italic pl-2">No items</p>
            ) : (
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left py-1 px-2 font-medium text-slate-500">Food</th>
                    <th className="text-right py-1 px-2 font-medium text-slate-500">Portion</th>
                    <th className="text-right py-1 px-2 font-medium text-slate-500">Cal</th>
                    <th className="text-right py-1 px-2 font-medium text-slate-500">C (g)</th>
                    <th className="text-right py-1 px-2 font-medium text-slate-500">F (g)</th>
                    <th className="text-right py-1 px-2 font-medium text-slate-500">P (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: LibraryMealPlanItem) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="py-1 px-2 text-slate-800 font-medium">{item.foodName}</td>
                      <td className="py-1 px-2 text-right text-slate-600">{item.portionGrams}{item.unit}</td>
                      <td className="py-1 px-2 text-right text-slate-600">{Math.round(item.calories ?? 0)}</td>
                      <td className="py-1 px-2 text-right text-slate-600">{(item.carbs ?? 0).toFixed(1)}</td>
                      <td className="py-1 px-2 text-right text-slate-600">{(item.fat ?? 0).toFixed(1)}</td>
                      <td className="py-1 px-2 text-right text-slate-600">{(item.protein ?? 0).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}


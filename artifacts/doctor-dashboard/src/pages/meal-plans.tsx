import { useState, useMemo, useEffect, useCallback } from "react";
import { PrintButton } from "@/components/print-button";
import { MealPlanPrintReport } from "@/components/meal-plan-print-report";
import { usePrint } from "@/hooks/usePrint";
import { usePagination } from "@/hooks/usePagination";
import { PrintLayout } from "@/components/print-layout";
import { PrintFilterDialog, type PrintFilterResult } from "@/components/print-filter-dialog";
import {
  useGetLibraryMealPlans,
  useCreateLibraryMealPlan,
  useUpdateLibraryMealPlan,
  useDeleteLibraryMealPlan,
  useGetLibraryMealPlan,
  useAddLibraryMealPlanItem,
  useDeleteLibraryMealPlanItem,
  getGetLibraryMealPlansQueryKey,
  getGetLibraryMealPlanQueryKey,
  useListMealTypes,
  useGetFoods,
  useListRecipes,
  useGetRecipe,
} from "@workspace/api-client-react";
import type { LibraryMealPlan, LibraryMealPlanItem, Food, Recipe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCanWrite } from "@/hooks/useRole";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2, Plus, Search, ClipboardList, Pencil, Trash2, ChevronDown, ChevronUp,
  Coffee, Sun, Moon, BookOpen, Users, Eye, X, UtensilsCrossed, ChevronLeft, ChevronRight,
} from "lucide-react";

const KNOWN_MEAL_STYLES: Record<string, { icon: typeof Coffee; color: string }> = {
  breakfast: { icon: Coffee, color: "bg-amber-50 text-amber-600 border-amber-100" },
  lunch: { icon: Sun, color: "bg-sky-50 text-sky-600 border-sky-100" },
  dinner: { icon: Moon, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
};
const DEFAULT_MEAL_STYLE = { icon: UtensilsCrossed, color: "bg-slate-50 text-slate-600 border-slate-100" };

function getMealStyle(name: string) {
  return KNOWN_MEAL_STYLES[name.toLowerCase()] ?? DEFAULT_MEAL_STYLE;
}

export default function MealPlansPage() {
  const [search, setSearch] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<LibraryMealPlan | null>(null);
  const [deletePlanId, setDeletePlanId] = useState<number | null>(null);
  const [viewPlan, setViewPlan] = useState<LibraryMealPlan | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [addItemMeal, setAddItemMeal] = useState<string | null>(null);
  const { data: mealTypesData } = useListMealTypes();
  const mealTypeNames = useMemo(
    () => (mealTypesData ?? []).map((mt) => mt.name),
    [mealTypesData]
  );

  const { data: plans, isLoading } = useGetLibraryMealPlans();
  const { data: planDetail, isLoading: detailLoading } = useGetLibraryMealPlan(
    selectedPlanId ?? 0,
    { query: { queryKey: getGetLibraryMealPlanQueryKey(selectedPlanId ?? 0), enabled: selectedPlanId !== null } }
  );
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPlan = useCreateLibraryMealPlan();
  const updatePlan = useUpdateLibraryMealPlan();
  const deletePlan = useDeleteLibraryMealPlan();
  const addItem = useAddLibraryMealPlanItem();
  const deleteItem = useDeleteLibraryMealPlanItem();

  const filtered = useMemo(() => {
    if (!plans) return [];
    const q = search.toLowerCase().trim();
    if (!q) return plans;
    return plans.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
    );
  }, [plans, search]);

  const pagination = usePagination({
    totalItems: filtered.length,
    pageSize: 25,
    resetDeps: [search],
  });

  const paginatedPlans = filtered.slice(pagination.startIndex, pagination.endIndex);

  function handleCreate(name: string, description: string) {
    createPlan.mutate(
      { data: { name, description } },
      {
        onSuccess: (plan) => {
          queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlansQueryKey() });
          setSelectedPlanId(plan.id);
          setCreateOpen(false);
          toast({ title: "Meal plan created" });
        },
        onError: () => toast({ title: "Failed to create plan", variant: "destructive" }),
      }
    );
  }

  function handleUpdate(planId: number, name: string, description: string) {
    updatePlan.mutate(
      { planId, data: { name, description } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlansQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlanQueryKey(planId) });
          setEditPlan(null);
          toast({ title: "Plan updated" });
        },
        onError: () => toast({ title: "Failed to update plan", variant: "destructive" }),
      }
    );
  }

  function handleDelete(planId: number) {
    deletePlan.mutate(
      { planId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlansQueryKey() });
          if (selectedPlanId === planId) setSelectedPlanId(null);
          setDeletePlanId(null);
          toast({ title: "Plan deleted" });
        },
        onError: () => toast({ title: "Failed to delete plan", variant: "destructive" }),
      }
    );
  }

  function handleAddItem(mealType: string, formData: {
    foodName: string; portionGrams: number; unit: string;
    calories: number; carbs: number; fat: number; protein: number; notes: string;
  }) {
    if (!selectedPlanId) return;
    addItem.mutate(
      {
        planId: selectedPlanId,
        data: { mealType, ...formData },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlanQueryKey(selectedPlanId) });
          setAddItemMeal(null);
          toast({ title: `Added to ${mealType}` });
        },
        onError: () => toast({ title: "Failed to add item", variant: "destructive" }),
      }
    );
  }

  function handleDeleteItem(itemId: number) {
    if (!selectedPlanId) return;
    deleteItem.mutate(
      { planId: selectedPlanId, itemId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlanQueryKey(selectedPlanId) });
          toast({ title: "Item removed" });
        },
        onError: () => toast({ title: "Failed to remove item", variant: "destructive" }),
      }
    );
  }

  const canWrite = useCanWrite();
  const { printRef, handlePrint, isPrinting, onDataReady, printError, cancelPrint } = usePrint("Meal Plans Report", true);
  const [printFilterOpen, setPrintFilterOpen] = useState(false);
  const [selectedPrintPlanIds, setSelectedPrintPlanIds] = useState<number[] | null>(null);
  const [printSelectedSections, setPrintSelectedSections] = useState<Set<string>>(new Set(["summary", "plan-list"]));
  const [printDateRange, setPrintDateRange] = useState<{ start: string; end: string } | undefined>(undefined);

  const MEAL_PLANS_PRINT_SECTIONS = useMemo(() => [
    { id: "summary",   label: "Library Summary", defaultChecked: true },
    { id: "plan-list", label: "Plan Details",     defaultChecked: true },
  ], []);

  const planEntities = useMemo(
    () => (plans ?? []).map((p) => ({ id: String(p.id), label: p.name })),
    [plans]
  );

  const printedPlans = useMemo(() => {
    let result = !selectedPrintPlanIds ? plans ?? [] : (plans ?? []).filter(p => selectedPrintPlanIds.includes(p.id));
    if (printDateRange) {
      result = result.filter(p => {
        const date = p.createdAt?.slice(0, 10);
        if (!date) return true;
        if (printDateRange.start && date < printDateRange.start) return false;
        if (printDateRange.end && date > printDateRange.end) return false;
        return true;
      });
    }
    return result;
  }, [plans, selectedPrintPlanIds, printDateRange]);

  const handlePrintFilterConfirm = useCallback((result: PrintFilterResult) => {
    setPrintSelectedSections(new Set(result.selectedIds));
    setSelectedPrintPlanIds(result.selectedEntityIds.map(Number));
    setPrintDateRange(result.dateRange);
    handlePrint();
  }, [handlePrint]);

  const getMealItems = (mt: string): LibraryMealPlanItem[] =>
    planDetail?.items?.filter((i) => i.mealType.toLowerCase() === mt.toLowerCase()) ?? [];

  const totalNutrition = mealTypeNames.reduce(
    (acc, name) => {
      const items = getMealItems(name);
      return items.reduce(
        (a, i) => ({
          calories: a.calories + (i.calories ?? 0),
          carbs: a.carbs + (i.carbs ?? 0),
          fat: a.fat + (i.fat ?? 0),
          protein: a.protein + (i.protein ?? 0),
        }),
        acc
      );
    },
    { calories: 0, carbs: 0, fat: 0, protein: 0 }
  );

  return (
    <PrintLayout innerRef={printRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meal Plans Library</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Create and manage reusable meal plans — assign them to patients from their profile
          </p>
        </div>
        <div className="flex items-center gap-2">
          {printError && (
            <span className="no-print text-xs text-red-500">{printError}</span>
          )}
          {isPrinting && !printError && (
            <span className="no-print flex items-center gap-1.5 text-xs text-slate-400">
              Preparing report…
              <button onClick={cancelPrint} className="text-slate-400 hover:text-slate-600 underline underline-offset-2">Cancel</button>
            </span>
          )}
          <PrintButton onPrint={() => setPrintFilterOpen(true)} />
          {canWrite && (
            <Button onClick={() => setCreateOpen(true)} className="no-print gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              New Plan
            </Button>
          )}
        </div>
      </div>

      <PrintFilterDialog
        open={printFilterOpen}
        onOpenChange={setPrintFilterOpen}
        title="Print Meal Plans"
        description="Choose which sections and plans to include in the report."
        options={MEAL_PLANS_PRINT_SECTIONS}
        showDateRange
        entities={planEntities}
        entityLabel="Plans to Include"
        onConfirm={handlePrintFilterConfirm}
      />

      {/* Stats Row */}
      <div className="no-print grid grid-cols-2 gap-4 max-w-sm">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{plans?.length ?? 0}</p>
                <p className="text-xs text-slate-500">Library Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">
                  {plans?.length ?? 0}
                </p>
                <p className="text-xs text-slate-500">Assignable Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="no-print grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plan List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-200">
              <CardContent className="py-10 flex flex-col items-center gap-2 text-slate-400">
                <ClipboardList className="h-8 w-8 opacity-30" />
                <p className="text-sm">{search ? "No plans match" : "No plans yet"}</p>
                {!search && (
                  <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Create First Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {paginatedPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer border transition-all hover:shadow-sm ${
                    selectedPlanId === plan.id
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{plan.name}</p>
                        {plan.description && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{plan.description}</p>
                        )}
                      </div>
                      <div className="no-print flex gap-1 shrink-0">
                        {canWrite && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-primary"
                            onClick={(e) => { e.stopPropagation(); setEditPlan(plan); }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-primary"
                          onClick={(e) => { e.stopPropagation(); setViewPlan(plan); }}
                          title="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {canWrite && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-destructive"
                            onClick={(e) => { e.stopPropagation(); setDeletePlanId(plan.id); }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filtered.length > 0 && (
                <div className="no-print flex items-center justify-between pt-1">
                  <p className="text-xs text-slate-500">
                    {pagination.rangeStart}–{pagination.rangeEnd} of {filtered.length}
                  </p>
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        disabled={!pagination.hasPrev}
                        onClick={pagination.goPrev}
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-xs text-slate-500">
                        {pagination.currentPage}/{pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        disabled={!pagination.hasNext}
                        onClick={pagination.goNext}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Plan Detail */}
        <div className="lg:col-span-2">
          {selectedPlanId === null ? (
            <Card className="border-dashed border-2 border-slate-200 h-full">
              <CardContent className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
                <ClipboardList className="h-12 w-12 opacity-20" />
                <p className="text-sm font-medium">Select a plan to view and edit its meals</p>
              </CardContent>
            </Card>
          ) : detailLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : planDetail ? (
            <div className="space-y-4">
              {/* Macro totals */}
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{planDetail.name}</CardTitle>
                      {planDetail.description && (
                        <CardDescription className="mt-0.5">{planDetail.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {[
                      { label: "Calories", value: `${Math.round(totalNutrition.calories)} kcal`, color: "text-orange-600" },
                      { label: "Carbs", value: `${totalNutrition.carbs.toFixed(1)}g`, color: "text-yellow-600" },
                      { label: "Fat", value: `${totalNutrition.fat.toFixed(1)}g`, color: "text-blue-600" },
                      { label: "Protein", value: `${totalNutrition.protein.toFixed(1)}g`, color: "text-green-600" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center bg-slate-50 rounded-xl py-3 border border-slate-100">
                        <p className={`text-sm font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-slate-400">{label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Meal sections */}
              {mealTypeNames.map((mealTypeName) => {
                const { icon: Icon, color } = getMealStyle(mealTypeName);
                const items = getMealItems(mealTypeName);
                const mealCals = items.reduce((a, i) => a + (i.calories ?? 0), 0);
                const isExpanded = expandedMeal === mealTypeName;
                return (
                  <Card key={mealTypeName} className="border border-slate-200">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <button
                          className="no-print flex items-center gap-3 flex-1 text-left"
                          onClick={() => setExpandedMeal(isExpanded ? null : mealTypeName)}
                        >
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{mealTypeName}</p>
                            <p className="text-xs text-slate-400">
                              {items.length} item{items.length !== 1 ? "s" : ""} · {Math.round(mealCals)} kcal
                            </p>
                          </div>
                          <div className="ml-auto mr-2">
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                          </div>
                        </button>
                        {canWrite && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="no-print h-7 text-xs gap-1"
                            onClick={() => { setAddItemMeal(mealTypeName); setExpandedMeal(mealTypeName); }}
                          >
                            <Plus className="h-3 w-3" />Add Food
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="pt-0 px-4 pb-4 space-y-3">
                        {addItemMeal === mealTypeName && (
                          <AddItemForm
                            label={mealTypeName}
                            onSubmit={(data) => handleAddItem(mealTypeName, data)}
                            onCancel={() => setAddItemMeal(null)}
                            isPending={addItem.isPending}
                          />
                        )}
                        {items.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-3">No foods added yet</p>
                        ) : (
                          <div className="space-y-2">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-slate-100">
                                <div>
                                  <p className="text-sm font-medium text-slate-800">{item.foodName}</p>
                                  <p className="text-xs text-slate-400">
                                    {item.portionGrams}{item.unit} · {Math.round(item.calories ?? 0)} kcal
                                    {" · "}C:{(item.carbs ?? 0).toFixed(1)}g · F:{(item.fat ?? 0).toFixed(1)}g · P:{(item.protein ?? 0).toFixed(1)}g
                                  </p>
                                </div>
                                {canWrite && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="no-print h-7 w-7 text-slate-400 hover:text-destructive"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Create Dialog */}
      <PlanFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isPending={createPlan.isPending}
        title="Create Meal Plan"
      />

      {/* Edit Dialog */}
      {editPlan && (
        <PlanFormDialog
          open={!!editPlan}
          onClose={() => setEditPlan(null)}
          onSubmit={(name, desc) => handleUpdate(editPlan.id, name, desc)}
          isPending={updatePlan.isPending}
          title="Edit Meal Plan"
          initialValues={{ name: editPlan.name, description: editPlan.description ?? "" }}
        />
      )}

      {/* View Detail */}
      {viewPlan && (
        <MealPlanDetailDialog
          plan={viewPlan}
          onClose={() => setViewPlan(null)}
        />
      )}

      {/* Delete Confirm */}
      <AlertDialog open={deletePlanId !== null} onOpenChange={() => setDeletePlanId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meal Plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the plan and all its food items. Any kids assigned to this plan will be unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletePlanId && handleDelete(deletePlanId)}
            >
              {deletePlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isPrinting && (
        <div className="hidden print-section space-y-4">
          {printSelectedSections.has("summary") && (
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-2">Meal Plan Library — Summary</h2>
              <table className="w-full text-xs border-collapse max-w-xs">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 px-2 font-semibold text-slate-600">Total Plans</td>
                    <td className="py-1 px-2 text-slate-800">{printedPlans.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <div className={printSelectedSections.has("plan-list") ? undefined : "hidden"}>
            {printSelectedSections.has("plan-list") && (
              <h2 className="text-base font-bold text-slate-800 mb-2">
                Plan Details ({printedPlans.length})
              </h2>
            )}
            <MealPlanPrintReport onReady={onDataReady} filterIds={printedPlans.map(p => p.id)} />
          </div>
        </div>
      )}
    </PrintLayout>
  );
}

// ── Meal Plan Detail Dialog ───────────────────────────────────────────────────

function MealPlanDetailDialog({
  plan,
  onClose,
}: {
  plan: LibraryMealPlan;
  onClose: () => void;
}) {
  const { data: detail, isLoading } = useGetLibraryMealPlan(plan.id, {
    query: { queryKey: getGetLibraryMealPlanQueryKey(plan.id), enabled: true },
  });
  const { data: mealTypesData } = useListMealTypes();
  const mealTypeNames = useMemo(
    () => (mealTypesData ?? []).map((mt) => mt.name),
    [mealTypesData]
  );

  const totalNutrition = detail?.items
    ? detail.items.reduce(
        (acc, i) => ({
          calories: acc.calories + (i.calories ?? 0),
          carbs: acc.carbs + (i.carbs ?? 0),
          fat: acc.fat + (i.fat ?? 0),
          protein: acc.protein + (i.protein ?? 0),
        }),
        { calories: 0, carbs: 0, fat: 0, protein: 0 }
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden">
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">{plan.name}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 mt-0.5">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {plan.description && (
            <p className="text-sm text-slate-600">{plan.description}</p>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : detail ? (
            <>
              {totalNutrition && (
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Calories", value: `${Math.round(totalNutrition.calories)}`, unit: "kcal", color: "text-orange-600", bg: "bg-orange-50" },
                    { label: "Carbs",    value: totalNutrition.carbs.toFixed(1),   unit: "g", color: "text-yellow-600", bg: "bg-yellow-50" },
                    { label: "Fat",      value: totalNutrition.fat.toFixed(1),     unit: "g", color: "text-blue-600",   bg: "bg-blue-50"   },
                    { label: "Protein",  value: totalNutrition.protein.toFixed(1), unit: "g", color: "text-green-600",  bg: "bg-green-50"  },
                  ].map(({ label, value, unit, color, bg }) => (
                    <div key={label} className={`rounded-xl py-3 text-center border border-slate-100 ${bg}`}>
                      <p className={`text-sm font-bold ${color}`}>{value}<span className="text-xs font-normal ml-0.5">{unit}</span></p>
                      <p className="text-xs text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {mealTypeNames.map((mealTypeName) => {
                const { icon: Icon, color } = getMealStyle(mealTypeName);
                const items = detail.items?.filter((i) => i.mealType.toLowerCase() === mealTypeName.toLowerCase()) ?? [];
                if (items.length === 0) return null;
                return (
                  <div key={mealTypeName}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-700">{mealTypeName}</h3>
                      <span className="text-xs text-slate-400">({items.length} item{items.length !== 1 ? "s" : ""})</span>
                    </div>
                    <div className="space-y-1.5 pl-9">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                          <div>
                            <p className="text-sm font-medium text-slate-800">{item.foodName}</p>
                            <p className="text-xs text-slate-400">
                              {item.portionGrams}{item.unit} · {Math.round(item.calories ?? 0)} kcal
                              {" · "}C:{(item.carbs ?? 0).toFixed(1)}g · F:{(item.fat ?? 0).toFixed(1)}g · P:{(item.protein ?? 0).toFixed(1)}g
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {(!detail.items || detail.items.length === 0) && (
                <p className="text-sm text-slate-400 text-center py-4">No food items in this plan yet.</p>
              )}
            </>
          ) : null}
        </div>

        <div className="px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Plan Form Dialog ──────────────────────────────────────────────────────────

function PlanFormDialog({
  open, onClose, onSubmit, isPending, title,
  initialValues,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
  isPending: boolean;
  title: string;
  initialValues?: { name: string; description: string };
}) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");

  useEffect(() => {
    if (open) {
      setName(initialValues?.name ?? "");
      setDescription(initialValues?.description ?? "");
    }
  }, [open, initialValues?.name, initialValues?.description]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Plan Name *</Label>
            <Input
              placeholder="e.g. Classic Keto Starter"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              placeholder="Optional notes about this plan..."
              value={description}
              maxLength={1000}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none rounded-xl"
              rows={4}
            />
            <p className="text-xs text-slate-400 text-right">{description.length} / 1000</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => onSubmit(name, description)}
            disabled={!name.trim() || isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Add Item Form ─────────────────────────────────────────────────────────────

type SourceMode = "food" | "recipe" | "manual";

function AddItemForm({
  label,
  onSubmit,
  onCancel,
  isPending,
}: {
  label: string;
  onSubmit: (data: {
    foodName: string; portionGrams: number; unit: string;
    calories: number; carbs: number; fat: number; protein: number; notes: string;
  }) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [mode, setMode] = useState<SourceMode>("food");
  const [foodName, setFoodName] = useState("");
  const [portionGrams, setPortionGrams] = useState(100);
  const [unit, setUnit] = useState("g");
  const [calories, setCalories] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);

  const [foodSearch, setFoodSearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  function resetFields() {
    setFoodName("");
    setPortionGrams(100);
    setUnit("g");
    setCalories(0);
    setCarbs(0);
    setFat(0);
    setProtein(0);
    setFoodSearch("");
    setRecipeSearch("");
    setSelectedRecipeId(null);
  }

  function switchMode(newMode: SourceMode) {
    if (newMode !== mode) {
      resetFields();
      setMode(newMode);
    }
  }

  const { data: foods } = useGetFoods();
  const { data: recipes } = useListRecipes();
  const { data: recipeDetail } = useGetRecipe(selectedRecipeId ?? 0, {
    query: { enabled: selectedRecipeId !== null },
  });

  const activeFoods = useMemo(() => (foods ?? []).filter((f) => f.isActive), [foods]);

  const filteredFoods = useMemo(() => {
    const q = foodSearch.toLowerCase().trim();
    if (!q) return activeFoods.slice(0, 20);
    return activeFoods.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 20);
  }, [activeFoods, foodSearch]);

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    const q = recipeSearch.toLowerCase().trim();
    if (!q) return recipes.slice(0, 20);
    return recipes.filter((r) => r.name.toLowerCase().includes(q)).slice(0, 20);
  }, [recipes, recipeSearch]);

  function selectFood(food: Food) {
    const scale = portionGrams / 100;
    setFoodName(food.name);
    setCalories(Math.round(food.calories * scale));
    setCarbs(parseFloat((food.carbs * scale).toFixed(1)));
    setFat(parseFloat((food.fat * scale).toFixed(1)));
    setProtein(parseFloat((food.protein * scale).toFixed(1)));
    setFoodSearch("");
  }

  function handlePortionChangeForFood(newPortion: number, food?: Food) {
    setPortionGrams(newPortion);
    const matched = food ?? foods?.find((f) => f.name === foodName);
    if (matched) {
      const scale = newPortion / 100;
      setCalories(Math.round(matched.calories * scale));
      setCarbs(parseFloat((matched.carbs * scale).toFixed(1)));
      setFat(parseFloat((matched.fat * scale).toFixed(1)));
      setProtein(parseFloat((matched.protein * scale).toFixed(1)));
    }
  }

  useEffect(() => {
    if (recipeDetail && selectedRecipeId !== null) {
      setFoodName(recipeDetail.name);
      setPortionGrams(100);
      setUnit("serving");
      setCalories(Math.round(recipeDetail.totalCalories));
      setCarbs(parseFloat(recipeDetail.totalCarbs.toFixed(1)));
      setFat(parseFloat(recipeDetail.totalFat.toFixed(1)));
      setProtein(parseFloat(recipeDetail.totalProtein.toFixed(1)));
    }
  }, [recipeDetail, selectedRecipeId]);

  const tabClass = (t: SourceMode) =>
    `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
      mode === t
        ? "bg-primary text-white shadow-sm"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
    }`;

  return (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Add to {label}</p>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
          <button className={tabClass("food")} onClick={() => switchMode("food")}>Food Library</button>
          <button className={tabClass("recipe")} onClick={() => switchMode("recipe")}>Recipe</button>
          <button className={tabClass("manual")} onClick={() => switchMode("manual")}>Manual</button>
        </div>
      </div>

      {mode === "food" && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search foods..."
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              className="h-8 text-sm pl-8"
            />
          </div>
          <div className="max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
            {filteredFoods.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">No foods found</p>
            ) : (
              filteredFoods.map((food) => (
                <button
                  key={food.id}
                  className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors ${
                    foodName === food.name ? "bg-blue-50 border-l-2 border-primary" : ""
                  }`}
                  onClick={() => selectFood(food)}
                >
                  <p className="text-sm font-medium text-slate-800">{food.name}</p>
                  <p className="text-xs text-slate-400">
                    {food.calories} kcal/100g · C:{food.carbs}g · F:{food.fat}g · P:{food.protein}g
                  </p>
                </button>
              ))
            )}
          </div>
          {foodName && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-blue-800">Selected: {foodName}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label className="text-xs mb-1 block">Portion (g)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={portionGrams}
                    onChange={(e) => handlePortionChangeForFood(Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <p className="text-xs text-slate-500 pb-2">
                    {calories} kcal · C:{carbs}g · F:{fat}g · P:{protein}g
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "recipe" && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search recipes..."
              value={recipeSearch}
              onChange={(e) => setRecipeSearch(e.target.value)}
              className="h-8 text-sm pl-8"
            />
          </div>
          <div className="max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
            {filteredRecipes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">No recipes found</p>
            ) : (
              filteredRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  className={`w-full text-left px-3 py-2 hover:bg-green-50 transition-colors ${
                    selectedRecipeId === recipe.id ? "bg-green-50 border-l-2 border-green-500" : ""
                  }`}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                >
                  <p className="text-sm font-medium text-slate-800">{recipe.name}</p>
                  <p className="text-xs text-slate-400">{recipe.category}</p>
                </button>
              ))
            )}
          </div>
          {recipeDetail && selectedRecipeId !== null && (
            <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-green-800">Selected: {recipeDetail.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {Math.round(recipeDetail.totalCalories)} kcal · C:{recipeDetail.totalCarbs.toFixed(1)}g · F:{recipeDetail.totalFat.toFixed(1)}g · P:{recipeDetail.totalProtein.toFixed(1)}g
              </p>
              {recipeDetail.ingredients.length > 0 && (
                <div className="mt-1.5">
                  <p className="text-xs text-slate-400">Ingredients: {recipeDetail.ingredients.map(i => i.foodName).join(", ")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {mode === "manual" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <Label className="text-xs mb-1 block">Food name *</Label>
            <Input
              placeholder="e.g. Avocado"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Portion</Label>
            <Input
              type="number"
              min={1}
              value={portionGrams}
              onChange={(e) => setPortionGrams(Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Unit</Label>
            <Input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Calories</Label>
            <Input type="number" min={0} value={calories} onChange={(e) => setCalories(Number(e.target.value))} className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Carbs (g)</Label>
            <Input type="number" min={0} value={carbs} onChange={(e) => setCarbs(Number(e.target.value))} className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Fat (g)</Label>
            <Input type="number" min={0} value={fat} onChange={(e) => setFat(Number(e.target.value))} className="h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Protein (g)</Label>
            <Input type="number" min={0} value={protein} onChange={(e) => setProtein(Number(e.target.value))} className="h-8 text-sm" />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          className="h-7 text-xs"
          disabled={!foodName.trim() || isPending}
          onClick={() => onSubmit({ foodName, portionGrams, unit, calories, carbs, fat, protein, notes: "" })}
        >
          {isPending && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
          Add
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

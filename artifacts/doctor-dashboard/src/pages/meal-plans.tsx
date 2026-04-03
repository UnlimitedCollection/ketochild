import { useState, useMemo, useEffect, useRef } from "react";
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
  useGetFoods,
} from "@workspace/api-client-react";
import type { LibraryMealPlan, LibraryMealPlanItem, Food } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCanWrite } from "@/hooks/useRole";
import {
  Card, CardContent, CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2, Plus, Search, ClipboardList, Pencil, Trash2,
  Coffee, Sun, Moon, ChevronDown, ChevronUp, X, Utensils,
} from "lucide-react";

const DEFAULT_MEAL_SECTIONS = ["Breakfast", "Lunch", "Dinner"];

const SECTION_STYLES: Record<string, { icon: React.ElementType; color: string }> = {
  Breakfast: { icon: Coffee, color: "bg-amber-50 text-amber-600 border-amber-200" },
  Lunch:     { icon: Sun,    color: "bg-sky-50 text-sky-600 border-sky-200" },
  Dinner:    { icon: Moon,   color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
};

const CUSTOM_SECTION_COLORS = [
  "bg-purple-50 text-purple-600 border-purple-200",
  "bg-green-50 text-green-600 border-green-200",
  "bg-rose-50 text-rose-600 border-rose-200",
  "bg-teal-50 text-teal-600 border-teal-200",
  "bg-orange-50 text-orange-600 border-orange-200",
];

function getSectionStyle(mealType: string, index: number): { icon: React.ElementType; color: string } {
  if (SECTION_STYLES[mealType]) return SECTION_STYLES[mealType];
  return { icon: Utensils, color: CUSTOM_SECTION_COLORS[index % CUSTOM_SECTION_COLORS.length] };
}

export default function MealPlansPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<LibraryMealPlan | null>(null);
  const [deletePlanId, setDeletePlanId] = useState<number | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null);

  const { data: plans, isLoading } = useGetLibraryMealPlans();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const canWrite = useCanWrite();

  const createPlan = useCreateLibraryMealPlan();
  const updatePlan = useUpdateLibraryMealPlan();
  const deletePlan = useDeleteLibraryMealPlan();

  function handleCreate(name: string, description: string) {
    createPlan.mutate(
      { data: { name, description } },
      {
        onSuccess: (plan) => {
          queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlansQueryKey() });
          setCreateOpen(false);
          setExpandedPlanId(plan.id);
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
          if (expandedPlanId === planId) setExpandedPlanId(null);
          setDeletePlanId(null);
          toast({ title: "Plan deleted" });
        },
        onError: () => toast({ title: "Failed to delete plan", variant: "destructive" }),
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meal Plans</h1>
          <p className="text-sm text-slate-500 mt-0.5">Create and manage reusable meal plans</p>
        </div>
        {canWrite && (
          <Button onClick={() => setCreateOpen(true)} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !plans || plans.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <ClipboardList className="h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">No meal plans yet</p>
            {canWrite && (
              <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Create First Plan
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isExpanded={expandedPlanId === plan.id}
              onToggle={() => setExpandedPlanId(expandedPlanId === plan.id ? null : plan.id)}
              onEdit={() => setEditPlan(plan)}
              onDelete={() => setDeletePlanId(plan.id)}
              canWrite={canWrite}
            />
          ))}
        </div>
      )}

      <PlanFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isPending={createPlan.isPending}
        title="Create Meal Plan"
      />

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

      <AlertDialog open={deletePlanId !== null} onOpenChange={() => setDeletePlanId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meal Plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the plan and all its food items.
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
    </div>
  );
}

// ── Plan Card ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  canWrite,
}: {
  plan: LibraryMealPlan;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canWrite: boolean;
}) {
  const { data: planDetail, isLoading: detailLoading } = useGetLibraryMealPlan(plan.id, {
    query: {
      queryKey: getGetLibraryMealPlanQueryKey(plan.id),
      enabled: isExpanded,
    },
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const addItem = useAddLibraryMealPlanItem();
  const deleteItem = useDeleteLibraryMealPlanItem();

  const [extraSections, setExtraSections] = useState<string[]>([]);
  const [addMealOpen, setAddMealOpen] = useState(false);
  const [newMealName, setNewMealName] = useState("");
  const newMealInputRef = useRef<HTMLInputElement>(null);

  const allSections = useMemo(() => {
    const fromItems = (planDetail?.items ?? []).map((i) => i.mealType);
    const seen = new Set<string>();
    const result: string[] = [];
    for (const name of [...DEFAULT_MEAL_SECTIONS, ...fromItems, ...extraSections]) {
      const key = name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(name);
      }
    }
    return result;
  }, [planDetail?.items, extraSections]);

  function handleAddItem(mealType: string, formData: {
    foodName: string; portionGrams: number; unit: string;
    calories: number; carbs: number; fat: number; protein: number; notes: string;
  }, callbacks?: { onSuccess?: () => void; onError?: () => void }) {
    addItem.mutate(
      { planId: plan.id, data: { mealType, ...formData } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlanQueryKey(plan.id) });
          toast({ title: `Added to ${mealType}` });
          callbacks?.onSuccess?.();
        },
        onError: () => {
          toast({ title: "Failed to add item", variant: "destructive" });
          callbacks?.onError?.();
        },
      }
    );
  }

  function handleDeleteItem(itemId: number) {
    deleteItem.mutate(
      { planId: plan.id, itemId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlanQueryKey(plan.id) });
          toast({ title: "Item removed" });
        },
        onError: () => toast({ title: "Failed to remove item", variant: "destructive" }),
      }
    );
  }

  function handleRemoveSection(mealType: string) {
    const items = getMealItems(mealType);
    if (items.length > 0) {
      items.forEach((item) => {
        deleteItem.mutate(
          { planId: plan.id, itemId: item.id },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlanQueryKey(plan.id) });
            },
          }
        );
      });
      toast({ title: `Removed all items from ${mealType}` });
    }
    setExtraSections((prev) => prev.filter((s) => s.toLowerCase() !== mealType.toLowerCase()));
  }

  function handleAddMealSection() {
    const name = newMealName.trim();
    if (!name) return;
    const exists = allSections.some((s) => s.toLowerCase() === name.toLowerCase());
    if (exists) {
      toast({ title: "Meal section already exists", variant: "destructive" });
      return;
    }
    setExtraSections((prev) => [...prev, name]);
    setNewMealName("");
    setAddMealOpen(false);
  }

  function getMealItems(mealType: string): LibraryMealPlanItem[] {
    return planDetail?.items?.filter(
      (i) => i.mealType.toLowerCase() === mealType.toLowerCase()
    ) ?? [];
  }

  const isDefault = (name: string) =>
    DEFAULT_MEAL_SECTIONS.some((d) => d.toLowerCase() === name.toLowerCase());

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between gap-3">
          <button
            className="flex items-center gap-3 flex-1 text-left min-w-0"
            onClick={onToggle}
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 truncate">{plan.name}</p>
              {plan.description && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{plan.description}</p>
              )}
            </div>
            {isExpanded
              ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
              : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
            }
          </button>
          <div className="flex items-center gap-1 shrink-0">
            {canWrite && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-primary"
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                title="Edit plan"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canWrite && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                title="Delete plan"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="px-4 pb-4 pt-0 border-t border-slate-100">
          {detailLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3 pt-3">
              {allSections.map((sectionName, idx) => {
                const { icon: Icon, color } = getSectionStyle(sectionName, idx);
                const items = getMealItems(sectionName);
                const removable = canWrite && (!isDefault(sectionName) || items.length === 0);
                return (
                  <MealSection
                    key={sectionName}
                    mealType={sectionName}
                    icon={Icon}
                    colorClass={color}
                    items={items}
                    canWrite={canWrite}
                    onAddItem={(data, callbacks) => handleAddItem(sectionName, data, callbacks)}
                    onDeleteItem={handleDeleteItem}
                    isAddPending={addItem.isPending}
                    onRemoveSection={removable ? () => handleRemoveSection(sectionName) : undefined}
                  />
                );
              })}

              {canWrite && (
                <div className="pt-1">
                  {addMealOpen ? (
                    <div className="flex items-center gap-2">
                      <Input
                        ref={newMealInputRef}
                        placeholder="e.g. Morning Snack, Supper..."
                        value={newMealName}
                        onChange={(e) => setNewMealName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddMealSection();
                          if (e.key === "Escape") { setAddMealOpen(false); setNewMealName(""); }
                        }}
                        className="h-8 text-sm flex-1"
                        autoFocus
                      />
                      <Button size="sm" className="h-8 text-xs px-3" onClick={handleAddMealSection}>
                        Add
                      </Button>
                      <Button
                        variant="outline" size="sm" className="h-8 text-xs px-3"
                        onClick={() => { setAddMealOpen(false); setNewMealName(""); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5 text-slate-500 border-dashed w-full"
                      onClick={() => setAddMealOpen(true)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Meal (e.g. Snack, Supper)
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ── Meal Section ──────────────────────────────────────────────────────────────

function MealSection({
  mealType,
  icon: Icon,
  colorClass,
  items,
  canWrite,
  onAddItem,
  onDeleteItem,
  isAddPending,
  onRemoveSection,
}: {
  mealType: string;
  icon: React.ElementType;
  colorClass: string;
  items: LibraryMealPlanItem[];
  canWrite: boolean;
  onAddItem: (data: {
    foodName: string; portionGrams: number; unit: string;
    calories: number; carbs: number; fat: number; protein: number; notes: string;
  }, callbacks?: { onSuccess?: () => void; onError?: () => void }) => void;
  onDeleteItem: (itemId: number) => void;
  isAddPending: boolean;
  onRemoveSection?: () => void;
}) {
  const [addOpen, setAddOpen] = useState(false);

  function handleSubmit(data: {
    foodName: string; portionGrams: number; unit: string;
    calories: number; carbs: number; fat: number; protein: number; notes: string;
  }) {
    onAddItem(data, {
      onSuccess: () => setAddOpen(false),
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${colorClass}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold text-slate-800">{mealType}</span>
          <span className="text-xs text-slate-500">({items.length} item{items.length !== 1 ? "s" : ""})</span>
        </div>
        <div className="flex items-center gap-1.5">
          {canWrite && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1 bg-white"
              onClick={() => setAddOpen(!addOpen)}
            >
              <Plus className="h-3 w-3" />
              Add Food
            </Button>
          )}
          {onRemoveSection && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-destructive hover:bg-red-50"
              onClick={onRemoveSection}
              title="Remove this meal section"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white">
        {addOpen && (
          <div className="border-b border-slate-100 p-3">
            <FoodPicker
              mealType={mealType}
              onSubmit={handleSubmit}
              onCancel={() => setAddOpen(false)}
              isPending={isAddPending}
            />
          </div>
        )}

        {items.length === 0 && !addOpen ? (
          <p className="text-xs text-slate-400 text-center py-4">No foods added yet</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-3 py-2.5">
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
                    className="h-7 w-7 text-slate-400 hover:text-destructive shrink-0"
                    onClick={() => onDeleteItem(item.id)}
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Food Picker ───────────────────────────────────────────────────────────────

function FoodPicker({
  mealType,
  onSubmit,
  onCancel,
  isPending,
}: {
  mealType: string;
  onSubmit: (data: {
    foodName: string; portionGrams: number; unit: string;
    calories: number; carbs: number; fat: number; protein: number; notes: string;
  }) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [foodSearch, setFoodSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [portionGrams, setPortionGrams] = useState(100);

  const { data: foods } = useGetFoods();
  const activeFoods = useMemo(() => (foods ?? []).filter((f) => f.isActive !== false), [foods]);

  const filteredFoods = useMemo(() => {
    const q = foodSearch.toLowerCase().trim();
    if (!q) return activeFoods.slice(0, 20);
    return activeFoods.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 20);
  }, [activeFoods, foodSearch]);

  const scaled = useMemo(() => {
    if (!selectedFood) return null;
    const scale = portionGrams / 100;
    return {
      calories: Math.round(selectedFood.calories * scale),
      carbs: parseFloat((selectedFood.carbs * scale).toFixed(1)),
      fat: parseFloat((selectedFood.fat * scale).toFixed(1)),
      protein: parseFloat((selectedFood.protein * scale).toFixed(1)),
    };
  }, [selectedFood, portionGrams]);

  function handleSelect(food: Food) {
    setSelectedFood(food);
    setFoodSearch("");
    setPortionGrams(100);
  }

  function handleSubmit() {
    if (!selectedFood || !scaled) return;
    onSubmit({
      foodName: selectedFood.name,
      portionGrams,
      unit: "g",
      calories: scaled.calories,
      carbs: scaled.carbs,
      fat: scaled.fat,
      protein: scaled.protein,
      notes: "",
    });
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Add food to {mealType}</p>

      {!selectedFood ? (
        <>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search foods..."
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              className="h-8 text-sm pl-8"
              autoFocus
            />
          </div>
          <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
            {filteredFoods.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">No foods found</p>
            ) : (
              filteredFoods.map((food) => (
                <button
                  key={food.id}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors"
                  onClick={() => handleSelect(food)}
                >
                  <p className="text-sm font-medium text-slate-800">{food.name}</p>
                  <p className="text-xs text-slate-400">
                    {food.calories} kcal/100g · C:{food.carbs}g · F:{food.fat}g · P:{food.protein}g
                  </p>
                </button>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-blue-800">{selectedFood.name}</p>
            <button
              className="text-slate-400 hover:text-slate-600"
              onClick={() => setSelectedFood(null)}
              title="Change food"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-slate-600 whitespace-nowrap">Portion (g)</Label>
              <Input
                type="number"
                min={1}
                value={portionGrams}
                onChange={(e) => setPortionGrams(Math.max(1, Number(e.target.value)))}
                className="h-7 text-sm w-20"
              />
            </div>
            {scaled && (
              <p className="text-xs text-slate-500">
                {scaled.calories} kcal · C:{scaled.carbs}g · F:{scaled.fat}g · P:{scaled.protein}g
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={onCancel} className="h-7 text-xs">
          Cancel
        </Button>
        <Button
          size="sm"
          className="h-7 text-xs"
          onClick={handleSubmit}
          disabled={!selectedFood || isPending}
        >
          {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
          Add
        </Button>
      </div>
    </div>
  );
}

// ── Plan Form Dialog ──────────────────────────────────────────────────────────

function PlanFormDialog({
  open, onClose, onSubmit, isPending, title, initialValues,
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

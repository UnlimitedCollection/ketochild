import { useState, useMemo, useEffect } from "react";
import {
  useGetLibraryMealPlans,
  useCreateLibraryMealPlan,
  useGetLibraryMealPlan,
  useAddLibraryMealPlanItem,
  useDeleteLibraryMealPlanItem,
  getGetLibraryMealPlanQueryKey,
  getGetLibraryMealPlansQueryKey,
  useGetFoods,
} from "@workspace/api-client-react";
import type { LibraryMealPlanItem, Food } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCanWrite } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2, Plus, Search, Coffee, Sun, Moon, X, Utensils,
} from "lucide-react";

const DEFAULT_MEAL_SECTIONS = ["Breakfast", "Lunch", "Dinner"];

const SECTION_STYLES: Record<string, { icon: React.ElementType; color: string; headerBg: string }> = {
  Breakfast: { icon: Coffee, color: "text-amber-600 border-amber-200 bg-amber-50",   headerBg: "bg-amber-50/60" },
  Lunch:     { icon: Sun,    color: "text-sky-600 border-sky-200 bg-sky-50",         headerBg: "bg-sky-50/60" },
  Dinner:    { icon: Moon,   color: "text-indigo-600 border-indigo-200 bg-indigo-50", headerBg: "bg-indigo-50/60" },
};

const CUSTOM_COLORS = [
  { color: "text-purple-600 border-purple-200 bg-purple-50", headerBg: "bg-purple-50/60" },
  { color: "text-green-600 border-green-200 bg-green-50",    headerBg: "bg-green-50/60" },
  { color: "text-rose-600 border-rose-200 bg-rose-50",       headerBg: "bg-rose-50/60" },
  { color: "text-teal-600 border-teal-200 bg-teal-50",       headerBg: "bg-teal-50/60" },
  { color: "text-orange-600 border-orange-200 bg-orange-50", headerBg: "bg-orange-50/60" },
];

function getSectionStyle(name: string, idx: number) {
  return SECTION_STYLES[name] ?? { icon: Utensils, ...CUSTOM_COLORS[idx % CUSTOM_COLORS.length] };
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function MealPlansPage() {
  const { data: plans, isLoading: plansLoading } = useGetLibraryMealPlans();
  const createPlan = useCreateLibraryMealPlan();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const canWrite = useCanWrite();

  const [planId, setPlanId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  // Pick the first plan, or create one silently if none exist
  useEffect(() => {
    if (plansLoading) return;
    if (plans && plans.length > 0) {
      setPlanId(plans[0].id);
      return;
    }
    if (!creating && !planId) {
      setCreating(true);
      createPlan.mutate(
        { data: { name: "Daily Meals", description: "" } },
        {
          onSuccess: (plan) => {
            queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlansQueryKey() });
            setPlanId(plan.id);
            setCreating(false);
          },
          onError: () => {
            setCreating(false);
            toast({ title: "Could not initialise meals", variant: "destructive" });
          },
        }
      );
    }
  }, [plansLoading, plans]);

  if (plansLoading || creating || !planId) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Meals</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage daily meal sections and foods</p>
      </div>

      <MealEditor planId={planId} canWrite={canWrite} />
    </div>
  );
}

// ── Meal Editor ────────────────────────────────────────────────────────────────

function MealEditor({ planId, canWrite }: { planId: number; canWrite: boolean }) {
  const { data: planDetail, isLoading } = useGetLibraryMealPlan(planId, {
    query: { queryKey: getGetLibraryMealPlanQueryKey(planId) },
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const addItem = useAddLibraryMealPlanItem();
  const deleteItem = useDeleteLibraryMealPlanItem();

  const [extraSections, setExtraSections] = useState<string[]>([]);
  const [addMealOpen, setAddMealOpen] = useState(false);
  const [newMealName, setNewMealName] = useState("");

  const allSections = useMemo(() => {
    const fromItems = (planDetail?.items ?? []).map((i) => i.mealType);
    const seen = new Set<string>();
    const result: string[] = [];
    for (const name of [...DEFAULT_MEAL_SECTIONS, ...fromItems, ...extraSections]) {
      const key = name.toLowerCase();
      if (!seen.has(key)) { seen.add(key); result.push(name); }
    }
    return result;
  }, [planDetail?.items, extraSections]);

  function getMealItems(mealType: string): LibraryMealPlanItem[] {
    return planDetail?.items?.filter(
      (i) => i.mealType.toLowerCase() === mealType.toLowerCase()
    ) ?? [];
  }

  function handleAddItem(
    mealType: string,
    data: { foodName: string; portionGrams: number; unit: string; calories: number; carbs: number; fat: number; protein: number; notes: string },
    callbacks?: { onSuccess?: () => void; onError?: () => void }
  ) {
    addItem.mutate(
      { planId, data: { mealType, ...data } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlanQueryKey(planId) });
          toast({ title: `Added to ${mealType}` });
          callbacks?.onSuccess?.();
        },
        onError: () => {
          toast({ title: "Failed to add food", variant: "destructive" });
          callbacks?.onError?.();
        },
      }
    );
  }

  function handleDeleteItem(itemId: number) {
    deleteItem.mutate(
      { planId, itemId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlanQueryKey(planId) });
          toast({ title: "Food removed" });
        },
        onError: () => toast({ title: "Failed to remove food", variant: "destructive" }),
      }
    );
  }

  function handleRemoveSection(mealType: string) {
    getMealItems(mealType).forEach((item) => {
      deleteItem.mutate(
        { planId, itemId: item.id },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetLibraryMealPlanQueryKey(planId) }) }
      );
    });
    setExtraSections((prev) => prev.filter((s) => s.toLowerCase() !== mealType.toLowerCase()));
    toast({ title: `Removed ${mealType}` });
  }

  function handleAddMealSection() {
    const name = newMealName.trim();
    if (!name) return;
    if (allSections.some((s) => s.toLowerCase() === name.toLowerCase())) {
      toast({ title: "Meal section already exists", variant: "destructive" });
      return;
    }
    setExtraSections((prev) => [...prev, name]);
    setNewMealName("");
    setAddMealOpen(false);
  }

  const isDefault = (name: string) =>
    DEFAULT_MEAL_SECTIONS.some((d) => d.toLowerCase() === name.toLowerCase());

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allSections.map((sectionName, idx) => {
        const { icon: Icon, color, headerBg } = getSectionStyle(sectionName, idx);
        const items = getMealItems(sectionName);
        const removable = canWrite && (!isDefault(sectionName) || items.length === 0);
        return (
          <MealSection
            key={sectionName}
            mealType={sectionName}
            icon={Icon}
            colorClass={color}
            headerBg={headerBg}
            items={items}
            canWrite={canWrite}
            onAddItem={(data, cbs) => handleAddItem(sectionName, data, cbs)}
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
                placeholder="e.g. Morning Snack, Supper, Evening Snack..."
                value={newMealName}
                onChange={(e) => setNewMealName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddMealSection();
                  if (e.key === "Escape") { setAddMealOpen(false); setNewMealName(""); }
                }}
                className="h-9 text-sm flex-1"
                autoFocus
              />
              <Button size="sm" className="h-9 px-4" onClick={handleAddMealSection}>Add</Button>
              <Button variant="outline" size="sm" className="h-9 px-4"
                onClick={() => { setAddMealOpen(false); setNewMealName(""); }}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline" size="sm"
              className="h-9 text-sm gap-2 text-slate-500 border-dashed w-full hover:border-primary hover:text-primary"
              onClick={() => setAddMealOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Meal (e.g. Snack, Supper)
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Meal Section ──────────────────────────────────────────────────────────────

function MealSection({
  mealType, icon: Icon, colorClass, headerBg, items, canWrite,
  onAddItem, onDeleteItem, isAddPending, onRemoveSection,
}: {
  mealType: string;
  icon: React.ElementType;
  colorClass: string;
  headerBg: string;
  items: LibraryMealPlanItem[];
  canWrite: boolean;
  onAddItem: (
    data: { foodName: string; portionGrams: number; unit: string; calories: number; carbs: number; fat: number; protein: number; notes: string },
    callbacks?: { onSuccess?: () => void; onError?: () => void }
  ) => void;
  onDeleteItem: (itemId: number) => void;
  isAddPending: boolean;
  onRemoveSection?: () => void;
}) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className={`flex items-center justify-between px-4 py-3 border-b border-slate-200 ${headerBg}`}>
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${colorClass}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="font-semibold text-slate-800">{mealType}</span>
          <span className="text-xs text-slate-500 font-normal">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {canWrite && (
            <Button
              variant="outline" size="sm"
              className="h-7 text-xs gap-1 bg-white/80 hover:bg-white"
              onClick={() => setAddOpen((v) => !v)}
            >
              <Plus className="h-3 w-3" />
              Add Food
            </Button>
          )}
          {onRemoveSection && (
            <Button
              variant="ghost" size="icon"
              className="h-7 w-7 text-slate-400 hover:text-destructive hover:bg-red-50"
              onClick={onRemoveSection}
              title="Remove this meal section"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {addOpen && (
        <div className="border-b border-slate-100 bg-slate-50/50 p-3">
          <FoodPicker
            mealType={mealType}
            onSubmit={(data) => onAddItem(data, { onSuccess: () => setAddOpen(false) })}
            onCancel={() => setAddOpen(false)}
            isPending={isAddPending}
          />
        </div>
      )}

      <div className="bg-white">
        {items.length === 0 && !addOpen ? (
          <p className="text-xs text-slate-400 text-center py-5">No foods added yet</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-2.5 group">
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.foodName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {item.portionGrams}{item.unit} &middot; {Math.round(item.calories ?? 0)} kcal
                    {" \u00b7 "}C:{(item.carbs ?? 0).toFixed(1)}g &middot; F:{(item.fat ?? 0).toFixed(1)}g &middot; P:{(item.protein ?? 0).toFixed(1)}g
                  </p>
                </div>
                {canWrite && (
                  <Button
                    variant="ghost" size="icon"
                    className="h-7 w-7 text-slate-300 hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteItem(item.id)}
                    title="Remove food"
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
  mealType, onSubmit, onCancel, isPending,
}: {
  mealType: string;
  onSubmit: (data: { foodName: string; portionGrams: number; unit: string; calories: number; carbs: number; fat: number; protein: number; notes: string }) => void;
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
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Add food to {mealType}
      </p>

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
                  onClick={() => { setSelectedFood(food); setFoodSearch(""); setPortionGrams(100); }}
                >
                  <p className="text-sm font-medium text-slate-800">{food.name}</p>
                  <p className="text-xs text-slate-400">
                    {food.calories} kcal/100g &middot; C:{food.carbs}g · F:{food.fat}g · P:{food.protein}g
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
            <button className="text-slate-400 hover:text-slate-600" onClick={() => setSelectedFood(null)}>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-slate-600 whitespace-nowrap">Portion (g)</Label>
              <Input
                type="number" min={1} value={portionGrams}
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
        <Button variant="outline" size="sm" onClick={onCancel} className="h-7 text-xs">Cancel</Button>
        <Button size="sm" className="h-7 text-xs" onClick={handleSubmit} disabled={!selectedFood || isPending}>
          {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
          Add
        </Button>
      </div>
    </div>
  );
}

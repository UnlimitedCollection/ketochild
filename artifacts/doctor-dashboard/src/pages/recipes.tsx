import { useState } from "react";
import {
  useListRecipes,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
  useGetRecipe,
  getListRecipesQueryKey,
} from "@workspace/api-client-react";
import type { RecipeDetail, RecipeIngredientRequest } from "@workspace/api-client-react";
import {
  Loader2,
  ChefHat,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  X,
  FlaskConical,
  Flame,
  Droplets,
  Beef,
  Wheat,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const BLUE  = "#004ac6";
const GREEN = "#0a7c42";
const RED   = "#ae0010";
const AMBER = "#855300";

const CATEGORIES = [
  "Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Smoothie", "Sauce", "Other",
];

interface IngredientRow {
  foodName: string;
  portionGrams: number | "";
  unit: string;
  fat: number | "";
  protein: number | "";
  carbs: number | "";
  calories: number | "";
}

const emptyRow = (): IngredientRow => ({
  foodName: "",
  portionGrams: "",
  unit: "g",
  fat: "",
  protein: "",
  carbs: "",
  calories: "",
});

function NutriBadge({
  label,
  value,
  unit = "g",
  color,
  icon,
}: {
  label: string;
  value: number;
  unit?: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-3 py-2 rounded-xl" style={{ background: `${color}12` }}>
      <div style={{ color }} className="mb-0.5">{icon}</div>
      <span className="text-xs font-bold" style={{ color }}>{value.toFixed(1)}{unit}</span>
      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}

function RecipeForm({
  initial,
  onClose,
  onSaved,
  recipeId,
}: {
  initial?: RecipeDetail | null;
  onClose: () => void;
  onSaved: () => void;
  recipeId?: number;
}) {
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    initial?.ingredients?.length
      ? initial.ingredients.map((i) => ({
          foodName: i.foodName,
          portionGrams: i.portionGrams,
          unit: i.unit,
          fat: i.fat,
          protein: i.protein,
          carbs: i.carbs,
          calories: i.calories,
        }))
      : [emptyRow()]
  );
  const [error, setError] = useState("");

  const updateIng = (idx: number, field: keyof IngredientRow, value: string) => {
    setIngredients((prev) => {
      const next = [...prev];
      if (field === "portionGrams" || field === "fat" || field === "protein" || field === "carbs" || field === "calories") {
        next[idx] = { ...next[idx], [field]: value === "" ? "" : Number(value) };
      } else {
        next[idx] = { ...next[idx], [field]: value };
      }
      return next;
    });
  };

  const addRow = () => setIngredients((prev) => [...prev, emptyRow()]);
  const removeRow = (idx: number) => setIngredients((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Recipe name is required."); return; }
    const validIngs = ingredients.filter((i) => i.foodName.trim());
    const ingPayload: RecipeIngredientRequest[] = validIngs.map((i) => ({
      foodName: i.foodName.trim(),
      portionGrams: Number(i.portionGrams) || 0,
      unit: i.unit || "g",
      fat: Number(i.fat) || 0,
      protein: Number(i.protein) || 0,
      carbs: Number(i.carbs) || 0,
      calories: Number(i.calories) || 0,
    }));

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      ingredients: ingPayload,
    };

    if (recipeId) {
      updateRecipe.mutate(
        { recipeId, data: payload },
        { onSuccess: onSaved, onError: (err: unknown) => setError((err as { data?: { message?: string } })?.data?.message ?? "Save failed") }
      );
    } else {
      createRecipe.mutate(
        { data: payload },
        { onSuccess: onSaved, onError: (err: unknown) => setError((err as { data?: { message?: string } })?.data?.message ?? "Save failed") }
      );
    }
  };

  const isPending = createRecipe.isPending || updateRecipe.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 py-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{recipeId ? "Edit Recipe" : "New Recipe"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4">
          <form id="recipe-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Recipe Name*</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Keto Egg Muffins"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                >
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief description or preparation notes…"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Ingredients</label>
                <button
                  type="button"
                  onClick={addRow}
                  className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add row
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Food Name", "g", "Unit", "Fat", "Prot", "Carb", "Kcal", ""].map((h) => (
                        <th key={h} className="px-2 py-2 text-left font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((row, idx) => (
                      <tr key={idx} className="border-t border-slate-100">
                        <td className="px-2 py-1">
                          <input
                            value={row.foodName}
                            onChange={(e) => updateIng(idx, "foodName", e.target.value)}
                            placeholder="Ingredient"
                            className="w-full border-0 bg-transparent outline-none text-slate-800 placeholder:text-slate-300 text-xs"
                          />
                        </td>
                        <td className="px-2 py-1 w-16">
                          <input
                            type="number"
                            value={row.portionGrams}
                            onChange={(e) => updateIng(idx, "portionGrams", e.target.value)}
                            placeholder="0"
                            className="w-full border-0 bg-transparent outline-none text-slate-800 text-xs"
                          />
                        </td>
                        <td className="px-2 py-1 w-12">
                          <input
                            value={row.unit}
                            onChange={(e) => updateIng(idx, "unit", e.target.value)}
                            placeholder="g"
                            className="w-full border-0 bg-transparent outline-none text-slate-800 text-xs"
                          />
                        </td>
                        {(["fat", "protein", "carbs", "calories"] as const).map((field) => (
                          <td key={field} className="px-2 py-1 w-14">
                            <input
                              type="number"
                              value={row[field]}
                              onChange={(e) => updateIng(idx, field, e.target.value)}
                              placeholder="0"
                              className="w-full border-0 bg-transparent outline-none text-slate-800 text-xs"
                            />
                          </td>
                        ))}
                        <td className="px-2 py-1 w-8">
                          <button type="button" onClick={() => removeRow(idx)} className="text-slate-300 hover:text-red-400">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="recipe-form"
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-[#004ac6] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChefHat className="h-4 w-4" />}
            {recipeId ? "Save Changes" : "Create Recipe"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipeDetailPanel({
  recipeId,
  onClose,
  onEdit,
}: {
  recipeId: number;
  onClose: () => void;
  onEdit: () => void;
}) {
  const { data: recipe, isLoading } = useGetRecipe(recipeId);

  if (isLoading || !recipe) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-2 py-4 sm:px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">{recipe.name}</h2>
            {recipe.category && (
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{recipe.category}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {recipe.description && (
            <p className="text-sm text-slate-600">{recipe.description}</p>
          )}

          <div className="grid grid-cols-4 gap-2">
            <NutriBadge label="Calories" value={recipe.totalCalories} unit="kcal" color={AMBER} icon={<Flame className="h-4 w-4" />} />
            <NutriBadge label="Fat" value={recipe.totalFat} color={GREEN} icon={<Droplets className="h-4 w-4" />} />
            <NutriBadge label="Protein" value={recipe.totalProtein} color={BLUE} icon={<Beef className="h-4 w-4" />} />
            <NutriBadge label="Carbs" value={recipe.totalCarbs} color={RED} icon={<Wheat className="h-4 w-4" />} />
          </div>

          {recipe.ingredients.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ingredients</h3>
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Name", "Amount", "Fat", "Prot", "Carb", "Kcal"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients.map((ing) => (
                      <tr key={ing.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-medium text-slate-700">{ing.foodName}</td>
                        <td className="px-3 py-2 text-slate-500">{ing.portionGrams}{ing.unit}</td>
                        <td className="px-3 py-2 text-slate-500">{ing.fat.toFixed(1)}g</td>
                        <td className="px-3 py-2 text-slate-500">{ing.protein.toFixed(1)}g</td>
                        <td className="px-3 py-2 text-slate-500">{ing.carbs.toFixed(1)}g</td>
                        <td className="px-3 py-2 text-slate-500">{ing.calories.toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecipesPage() {
  const queryClient = useQueryClient();
  const { data: recipes, isLoading } = useListRecipes();
  const deleteRecipe = useDeleteRecipe();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");

  const { data: editRecipe } = useGetRecipe(editId ?? 0, {
    query: { enabled: editId !== null },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListRecipesQueryKey() });

  const handleDelete = (id: number) => {
    deleteRecipe.mutate({ recipeId: id }, {
      onSuccess: () => {
        setConfirmDelete(null);
        invalidate();
      },
    });
  };

  const categories = Array.from(new Set((recipes ?? []).map((r) => r.category).filter(Boolean))) as string[];

  const filtered = (recipes ?? []).filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || r.category === filterCat;
    return matchSearch && matchCat;
  });

  const sorted = [...filtered].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    });
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Recipe Library</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Build and manage your collection of keto-friendly recipes
          </p>
        </div>
        <button
          onClick={() => { setEditId(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#004ac6] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          New Recipe
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Recipes",  value: (recipes ?? []).length,                                        color: BLUE  },
          { label: "Categories",     value: categories.length,                                             color: GREEN },
          { label: "Avg Ingredients",
            value: (recipes ?? []).length
              ? Math.round((recipes ?? []).reduce((s, r) => s + ((r as RecipeDetail).ingredients?.length ?? 0), 0) / (recipes ?? []).length)
              : 0,
            color: AMBER },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{ background: `${stat.color}18` }}
            >
              <ChefHat className="h-5 w-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes…"
            className="flex-1 min-w-48 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
            <ChefHat className="h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">
              {search || filterCat ? "No recipes match your filters" : "No recipes yet"}
            </p>
            {!search && !filterCat && (
              <p className="text-xs">Click "New Recipe" to create your first one</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sorted.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 cursor-pointer group transition-colors"
                onClick={() => setViewId(r.id)}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${BLUE}14` }}
                >
                  <ChefHat className="h-5 w-5" style={{ color: BLUE }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{r.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {r.category && (
                      <span className="text-xs font-medium text-slate-400">{r.category}</span>
                    )}
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-400">
                      {(r as RecipeDetail).ingredients?.length ?? 0} ingredients
                    </span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-400">Updated {formatDate(r.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span style={{ color: AMBER }}>{(r as RecipeDetail).totalCalories?.toFixed(0) ?? "–"} kcal</span>
                    <span style={{ color: GREEN }}>{(r as RecipeDetail).totalFat?.toFixed(1) ?? "–"}g fat</span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setEditId(r.id); setShowForm(true); }}
                    className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(r.id); }}
                    className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <RecipeForm
          initial={editId !== null ? (editRecipe ?? null) : null}
          recipeId={editId ?? undefined}
          onClose={() => { setShowForm(false); setEditId(null); }}
          onSaved={() => { setShowForm(false); setEditId(null); invalidate(); }}
        />
      )}

      {viewId !== null && (
        <RecipeDetailPanel
          recipeId={viewId}
          onClose={() => setViewId(null)}
          onEdit={() => { setEditId(viewId); setViewId(null); setShowForm(true); }}
        />
      )}

      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Recipe?</h3>
            <p className="text-sm text-slate-500 mb-6">This will permanently remove the recipe and all its ingredients.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleteRecipe.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {deleteRecipe.isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && viewId !== null && null}
    </div>
  );
}

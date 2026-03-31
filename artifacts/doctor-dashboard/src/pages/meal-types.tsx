import { useState } from "react";
import {
  useListMealTypes,
  useCreateMealType,
  useUpdateMealType,
  useDeleteMealType,
  useListRecipes,
  getListMealTypesQueryKey,
} from "@workspace/api-client-react";
import type { MealTypeItem } from "@workspace/api-client-react";
import {
  Loader2,
  Plus,
  Pencil,
  Eye,
  Trash2,
  X,
  UtensilsCrossed,
  Check,
  ChefHat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCanWrite } from "@/hooks/useRole";
import { usePagination } from "@/hooks/usePagination";

const BLUE = "#004ac6";

function RecipePicker({
  selectedIds,
  onChange,
}: {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}) {
  const { data: recipes = [] } = useListRecipes();
  const [search, setSearch] = useState("");

  const filtered = recipes.filter(
    (r) => !search || r.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <div className="mt-3">
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
        Assign Recipes
      </label>
      {recipes.length > 5 && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes…"
          className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      )}
      <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
        {recipes.length === 0 ? (
          <p className="text-xs text-slate-400 px-3 py-3 text-center">No recipes available</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-slate-400 px-3 py-3 text-center">No matching recipes</p>
        ) : (
          filtered.map((r) => (
            <label
              key={r.id}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-blue-50/50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(r.id)}
                onChange={() => toggle(r.id)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-300 h-3.5 w-3.5"
              />
              <ChefHat className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-700 truncate">{r.name}</span>
            </label>
          ))
        )}
      </div>
      {selectedIds.length > 0 && (
        <p className="text-[10px] text-slate-400 mt-1">
          {selectedIds.length} recipe{selectedIds.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}

export default function MealTypesPage() {
  const queryClient = useQueryClient();
  const { data: mealTypes, isLoading } = useListMealTypes();
  const createMealType = useCreateMealType();
  const updateMealType = useUpdateMealType();
  const deleteMealType = useDeleteMealType();

  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRecipeIds, setNewRecipeIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editRecipeIds, setEditRecipeIds] = useState<number[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const canWrite = useCanWrite();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getListMealTypesQueryKey() });

  const mealTypesList = mealTypes ?? [];
  const pagination = usePagination({
    totalItems: mealTypesList.length,
    pageSize: 25,
    resetDeps: [mealTypesList.length],
  });
  const paginatedMealTypes = mealTypesList.slice(pagination.startIndex, pagination.endIndex);

  function handleCreate() {
    if (!newName.trim()) return;
    setError("");
    createMealType.mutate(
      { data: { name: newName.trim(), recipeIds: newRecipeIds } },
      {
        onSuccess: () => {
          setNewName("");
          setNewRecipeIds([]);
          setAddingNew(false);
          invalidate();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { data?: { message?: string } })?.data?.message ??
            "Failed to create";
          setError(msg);
        },
      }
    );
  }

  function handleUpdate(id: number) {
    if (!editName.trim()) return;
    setError("");
    updateMealType.mutate(
      { id, data: { name: editName.trim(), recipeIds: editRecipeIds } },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditName("");
          setEditRecipeIds([]);
          invalidate();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { data?: { message?: string } })?.data?.message ??
            "Failed to update";
          setError(msg);
        },
      }
    );
  }

  function handleDelete(id: number) {
    deleteMealType.mutate(
      { id },
      {
        onSuccess: () => {
          setConfirmDeleteId(null);
          invalidate();
        },
      }
    );
  }

  function startEdit(mt: MealTypeItem) {
    setEditingId(mt.id);
    setEditName(mt.name);
    setEditRecipeIds(mt.recipes.map((r) => r.id));
    setAddingNew(false);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditRecipeIds([]);
    setError("");
  }

  function cancelAdd() {
    setAddingNew(false);
    setNewName("");
    setNewRecipeIds([]);
    setError("");
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Meal Types</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage the types of meals available across meal plans and logs
          </p>
        </div>
        {canWrite && !addingNew && (
          <button
            onClick={() => {
              setAddingNew(true);
              setEditingId(null);
              setError("");
            }}
            className="flex items-center gap-2 bg-[#004ac6] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            New Meal Type
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{ background: `${BLUE}18` }}
          >
            <UtensilsCrossed className="h-5 w-5" style={{ color: BLUE }} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Meal Types
            </p>
            <p className="text-2xl font-black text-slate-900">
              {(mealTypes ?? []).length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {addingNew && canWrite && (
          <div className="px-6 py-4 border-b border-slate-100 bg-blue-50/50">
            <div className="flex items-center gap-3">
              <UtensilsCrossed
                className="h-5 w-5 text-blue-500 shrink-0"
              />
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") cancelAdd();
                }}
                placeholder="Enter meal type name…"
                className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={handleCreate}
                disabled={createMealType.isPending || !newName.trim()}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                title="Save"
              >
                {createMealType.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={cancelAdd}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <RecipePicker selectedIds={newRecipeIds} onChange={setNewRecipeIds} />
          </div>
        )}

        {error && (
          <div className="px-6 py-2 bg-red-50 border-b border-red-100">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : mealTypesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
            <UtensilsCrossed className="h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">No meal types yet</p>
            <p className="text-xs">
              Click "New Meal Type" to create your first one
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {paginatedMealTypes.map((mt) => (
                <div
                  key={mt.id}
                  className="px-6 py-4 hover:bg-slate-50 group transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${BLUE}14` }}
                    >
                      <UtensilsCrossed
                        className="h-5 w-5"
                        style={{ color: BLUE }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingId === mt.id ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <input
                              autoFocus
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleUpdate(mt.id);
                                if (e.key === "Escape") cancelEdit();
                              }}
                              className="flex-1 border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <button
                              onClick={() => handleUpdate(mt.id)}
                              disabled={
                                updateMealType.isPending || !editName.trim()
                              }
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                              title="Save"
                            >
                              {updateMealType.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <RecipePicker selectedIds={editRecipeIds} onChange={setEditRecipeIds} />
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-slate-900 truncate">
                            {mt.name}
                          </p>
                          {mt.recipes.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {mt.recipes.map((r) => (
                                <span
                                  key={r.id}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 rounded-full px-2 py-0.5"
                                >
                                  <ChefHat className="h-3 w-3" />
                                  {r.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {editingId !== mt.id && canWrite && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => startEdit(mt)}
                          className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(mt.id)}
                          className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {mealTypesList.length > 0 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Showing {pagination.rangeStart}–{pagination.rangeEnd} of {mealTypesList.length}
                </p>
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      disabled={!pagination.hasPrev}
                      onClick={pagination.goPrev}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Previous
                    </button>
                    <span className="text-xs text-slate-500">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      disabled={!pagination.hasNext}
                      onClick={pagination.goNext}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Delete Meal Type?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              This will permanently remove this meal type. Existing meal plan
              items and logs using it will not be affected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleteMealType.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMealType.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

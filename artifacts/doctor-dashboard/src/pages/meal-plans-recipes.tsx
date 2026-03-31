import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MealPlansPage from "@/pages/meal-plans";
import RecipesPage from "@/pages/recipes";
import MealTypesPage from "@/pages/meal-types";

export default function MealPlansRecipesPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="meal-plans">
        <TabsList className="no-print mb-4">
          <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="meal-types">Meal Types</TabsTrigger>
        </TabsList>
        <TabsContent value="meal-plans">
          <MealPlansPage />
        </TabsContent>
        <TabsContent value="recipes">
          <RecipesPage />
        </TabsContent>
        <TabsContent value="meal-types">
          <MealTypesPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}

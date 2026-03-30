import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MealPlansPage from "@/pages/meal-plans";
import RecipesPage from "@/pages/recipes";

export default function MealPlansRecipesPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="meal-plans">
        <TabsList className="mb-4">
          <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
        </TabsList>
        <TabsContent value="meal-plans">
          <MealPlansPage />
        </TabsContent>
        <TabsContent value="recipes">
          <RecipesPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}

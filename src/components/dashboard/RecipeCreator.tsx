import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  CuisineSelector, 
  type CuisineLevel 
} from '@/components/dashboard/CuisineSelector';
import { MealTypeSelector } from '@/components/dashboard/MealTypeSelector';
import { 
  Sparkles, 
  Check, 
  Clock, 
  ChefHat, 
  Save, 
  Calendar,
  Coffee,
  Utensils,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  cooking_time: number;
  difficulty: string;
  image_prompt: string;
  image_url?: string;
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export function RecipeCreator() {
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineLevel | null>(null);
  const [mealTypeIngredients, setMealTypeIngredients] = useState<Record<MealType, string[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>(['dinner']);
  const [recipeCount, setRecipeCount] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[]>([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);
  const [showRecipeDialog, setShowRecipeDialog] = useState<boolean>(false);
  
  const { user } = useAuth();

  const handleToggleMealType = (mealType: MealType) => {
    setSelectedMealTypes(prev => {
      if (prev.includes(mealType)) {
        return prev.filter(type => type !== mealType);
      } else {
        return [...prev, mealType];
      }
    });
  };

  const handleAddMealTypeIngredient = (mealType: MealType, ingredient: string) => {
    if (!ingredient.trim()) return;
    
    setMealTypeIngredients(prev => {
      // Only add if the ingredient isn't already in the list
      if (!prev[mealType].includes(ingredient)) {
        return {
          ...prev,
          [mealType]: [...prev[mealType], ingredient]
        };
      }
      return prev;
    });
  };

  const handleRemoveMealTypeIngredient = (mealType: MealType, ingredient: string) => {
    setMealTypeIngredients(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(item => item !== ingredient)
    }));
  };

  const getAllIngredients = () => {
    const allIngredients = new Set<string>();
    
    Object.values(mealTypeIngredients).forEach(ingredients => {
      ingredients.forEach(ingredient => {
        allIngredients.add(ingredient);
      });
    });
    
    return Array.from(allIngredients);
  };

  const handleGenerateRecipes = async () => {
    if (!selectedCuisine) {
      toast.error("Please select a cuisine style first");
      return;
    }

    if (selectedMealTypes.length === 0) {
      toast.error("Please select at least one meal type");
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedRecipes([]);
      
      const response = await supabase.functions.invoke('generate-recipe', {
        body: {
          cuisineLevel: selectedCuisine,
          ingredients: getAllIngredients(),
          mealType: selectedMealTypes.join(','),
          count: recipeCount
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data.recipes || response.data.recipes.length === 0) {
        throw new Error("No recipes were generated");
      }

      setGeneratedRecipes(response.data.recipes);
      setSelectedRecipeIndex(0);
      setShowRecipeDialog(true);
      
      toast.success(`Generated ${response.data.recipes.length} recipe${response.data.recipes.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error("Error generating recipes:", error);
      toast.error(`Failed to generate recipes: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!user) {
      toast.error("You must be logged in to save recipes");
      return;
    }

    try {
      setIsSaving(true);
      
      const recipe = generatedRecipes[selectedRecipeIndex];
      const today = new Date();
      
      // Save recipe directly to the database instead of using the edge function
      // 1. Save the recipe
      const { data: savedRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cooking_time: recipe.cooking_time,
          difficulty: recipe.difficulty,
          image_url: recipe.image_url || null,
          user_id: user.id
        })
        .select()
        .single();

      if (recipeError) {
        throw new Error(`Failed to save recipe: ${recipeError.message}`);
      }

      // 2. Create meal plan entries for each selected meal type
      const mealPlansPromises = selectedMealTypes.map(mealType => {
        return supabase
          .from('meal_plans')
          .insert({
            recipe_id: savedRecipe.id,
            user_id: user.id,
            meal_type: mealType,
            planned_date: format(today, 'yyyy-MM-dd')
          });
      });

      // Wait for all meal plan entries to be created
      const mealPlanResults = await Promise.allSettled(mealPlansPromises);
      
      // Check for errors in creating meal plans
      const mealPlanErrors = mealPlanResults
        .filter(result => result.status === 'rejected' || (result.status === 'fulfilled' && result.value.error))
        .map(result => {
          if (result.status === 'rejected') {
            return result.reason;
          } else {
            return (result as PromiseFulfilledResult<{error: any}>).value.error;
          }
        });
        
      if (mealPlanErrors.length > 0) {
        console.error("Meal plan insert errors:", mealPlanErrors);
        // Log errors but don't throw since the recipe was saved successfully
      }

      toast.success("Recipe saved successfully!");
      
      // Close the dialog after saving
      setShowRecipeDialog(false);
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error(`Failed to save recipe: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedRecipe = generatedRecipes[selectedRecipeIndex];

  const getMealTypeIcon = (type: MealType) => {
    switch (type) {
      case 'breakfast':
        return <Coffee className="h-4 w-4" />;
      case 'lunch':
        return <Utensils className="h-4 w-4" />;
      case 'dinner':
        return <ChefHat className="h-4 w-4" />;
      case 'snack':
        return <Coffee className="h-4 w-4" />;
      default:
        return <Utensils className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Recipe</h1>
          <p className="text-gray-600">Customize your preferences or let AI surprise you</p>
        </div>
        <Badge className="bg-souschef-red/10 text-souschef-red border-souschef-red/20 px-3 py-1.5 flex items-center gap-1.5">
          <Sparkles size={14} />
          AI-Powered
        </Badge>
      </div>
      
      <div className="space-y-8">
        <CuisineSelector 
          selectedLevel={selectedCuisine}
          onSelect={setSelectedCuisine}
        />
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Number of Recipes</h2>
            <Select 
              value={recipeCount.toString()} 
              onValueChange={(value) => setRecipeCount(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Number of recipes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Single Recipe
                  </div>
                </SelectItem>
                <SelectItem value="3">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    3-Day Meal Plan
                  </div>
                </SelectItem>
                <SelectItem value="5">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    5-Day Meal Plan
                  </div>
                </SelectItem>
                <SelectItem value="7">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    7-Day Meal Plan
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <MealTypeSelector
          selectedMealTypes={selectedMealTypes}
          onToggleMealType={handleToggleMealType}
          onAddIngredient={handleAddMealTypeIngredient}
          onRemoveIngredient={handleRemoveMealTypeIngredient}
          mealTypeIngredients={mealTypeIngredients}
        />
        
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button 
            onClick={handleGenerateRecipes}
            disabled={!selectedCuisine || selectedMealTypes.length === 0 || isGenerating}
            className="px-6 bg-souschef-red hover:bg-souschef-red-light text-white"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} className="mr-2" />
                Generate Recipe
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Recipe Viewer Dialog */}
      <Dialog open={showRecipeDialog} onOpenChange={setShowRecipeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedRecipe.title}</DialogTitle>
                <DialogDescription>
                  {selectedRecipe.description}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <Clock size={14} /> {selectedRecipe.cooking_time} mins
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <ChefHat size={14} /> {selectedRecipe.difficulty}
                    </Badge>
                    {selectedMealTypes.map((mealType) => (
                      <Badge key={mealType} variant="outline" className="flex items-center gap-1.5">
                        {getMealTypeIcon(mealType)} {mealType}
                      </Badge>
                    ))}
                  </div>

                  {generatedRecipes.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {generatedRecipes.map((_, index) => (
                        <Button
                          key={index}
                          variant={index === selectedRecipeIndex ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedRecipeIndex(index)}
                          className={index === selectedRecipeIndex ? "bg-souschef-red hover:bg-souschef-red-light" : ""}
                        >
                          Recipe {index + 1}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Instructions</h3>
                    <div className="whitespace-pre-line text-gray-700">
                      {selectedRecipe.instructions}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowRecipeDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveRecipe}
                  disabled={isSaving}
                  className="bg-souschef-red hover:bg-souschef-red-light text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Recipe
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  ChefHat, 
  Save, 
  Coffee,
  Utensils,
  Loader2,
  Flame
} from 'lucide-react';
import { CuisineLevel } from '@/components/dashboard/CuisineSelector';

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  cooking_time: number;
  difficulty: string;
  image_prompt: string;
  image_url?: string;
  meal_type: string;
  calories_per_serving?: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface RecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipes: GeneratedRecipe[];
  selectedRecipeIndex: number;
  setSelectedRecipeIndex: (index: number) => void;
  onSaveRecipe: () => void;
  isSaving: boolean;
}

export function RecipeDialog({
  open,
  onOpenChange,
  recipes,
  selectedRecipeIndex,
  setSelectedRecipeIndex,
  onSaveRecipe,
  isSaving
}: RecipeDialogProps) {
  const selectedRecipe = recipes[selectedRecipeIndex];
  
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

  const recipesByMealType = recipes.reduce((acc, recipe, index) => {
    const mealType = recipe.meal_type || 'other';
    if (!acc[mealType]) acc[mealType] = [];
    acc[mealType].push({recipe, index});
    return acc;
  }, {} as Record<string, {recipe: GeneratedRecipe, index: number}[]>);

  if (!selectedRecipe) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <Badge variant="outline" className="flex items-center gap-1.5">
                {getMealTypeIcon(selectedRecipe.meal_type as MealType)} {selectedRecipe.meal_type}
              </Badge>
              {selectedRecipe.calories_per_serving !== undefined && (
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Flame size={14} /> {selectedRecipe.calories_per_serving} kcal
                </Badge>
              )}
            </div>

            {Object.keys(recipesByMealType).length > 0 && (
              <div className="space-y-2">
                {Object.entries(recipesByMealType).map(([mealType, recipes]) => (
                  <div key={mealType} className="space-y-2">
                    <div className="text-sm font-medium">{mealType.charAt(0).toUpperCase() + mealType.slice(1)} Recipes:</div>
                    <div className="flex gap-2 flex-wrap">
                      {recipes.map(({index}) => (
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
                  </div>
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={onSaveRecipe}
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
      </DialogContent>
    </Dialog>
  );
}

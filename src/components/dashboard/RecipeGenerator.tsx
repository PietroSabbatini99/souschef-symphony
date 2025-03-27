
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Calendar, Users } from 'lucide-react';
import { CuisineSelector, type CuisineLevel } from '@/components/dashboard/CuisineSelector';
import { MealTypeSelector } from '@/components/dashboard/MealTypeSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MealType } from './RecipeDialog';

interface RecipeGeneratorProps {
  selectedCuisine: CuisineLevel | null;
  setSelectedCuisine: (cuisine: CuisineLevel) => void;
  selectedMealTypes: MealType[];
  handleToggleMealType: (mealType: MealType) => void;
  mealTypeIngredients: Record<MealType, string[]>;
  handleAddMealTypeIngredient: (mealType: MealType, ingredient: string) => void;
  handleRemoveMealTypeIngredient: (mealType: MealType, ingredient: string) => void;
  recipeCount: number;
  setRecipeCount: (count: number) => void;
  servingsCount: number;
  setServingsCount: (count: number) => void;
  isGenerating: boolean;
  onGenerateRecipes: () => void;
}

export function RecipeGenerator({
  selectedCuisine,
  setSelectedCuisine,
  selectedMealTypes,
  handleToggleMealType,
  mealTypeIngredients,
  handleAddMealTypeIngredient,
  handleRemoveMealTypeIngredient,
  recipeCount,
  setRecipeCount,
  servingsCount,
  setServingsCount,
  isGenerating,
  onGenerateRecipes
}: RecipeGeneratorProps) {
  return (
    <div className="max-w-4xl mx-auto">
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
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Number of Persons</h2>
            <Select 
              value={servingsCount.toString()} 
              onValueChange={(value) => setServingsCount(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Number of persons" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      {num === 1 ? '1 Person' : `${num} Persons`}
                    </div>
                  </SelectItem>
                ))}
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
            onClick={onGenerateRecipes}
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
    </div>
  );
}

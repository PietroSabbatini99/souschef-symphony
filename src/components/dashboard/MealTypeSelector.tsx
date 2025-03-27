
import React from 'react';
import { MealTypeToggle } from './meal-type/MealTypeToggle';
import { IngredientInput } from './meal-type/IngredientInput';
import { IngredientsList } from './meal-type/IngredientsList';
import { QuickAddIngredients } from './meal-type/QuickAddIngredients';
import { MealType } from './RecipeDialog';

interface MealTypeSelectorProps {
  selectedMealTypes: MealType[];
  onToggleMealType: (mealType: MealType) => void;
  onAddIngredient: (mealType: MealType, ingredient: string) => void;
  onRemoveIngredient: (mealType: MealType, ingredient: string) => void;
  mealTypeIngredients: Record<MealType, string[]>;
}

export function MealTypeSelector({
  selectedMealTypes,
  onToggleMealType,
  onAddIngredient,
  onRemoveIngredient,
  mealTypeIngredients
}: MealTypeSelectorProps) {
  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold mb-4">Meal Types</h2>
      
      <div className="space-y-6">
        {mealTypes.map((mealType) => (
          <div key={mealType} className="space-y-4 p-4 border border-gray-200 rounded-lg">
            <MealTypeToggle 
              mealType={mealType} 
              isSelected={selectedMealTypes.includes(mealType)}
              onToggle={() => onToggleMealType(mealType)}
            />
            
            {selectedMealTypes.includes(mealType) && (
              <div className="space-y-4">
                <IngredientInput 
                  mealType={mealType} 
                  onAddIngredient={onAddIngredient} 
                />
                
                {mealTypeIngredients[mealType] && mealTypeIngredients[mealType].length > 0 && (
                  <IngredientsList 
                    mealType={mealType}
                    ingredients={mealTypeIngredients[mealType]}
                    onRemoveIngredient={onRemoveIngredient}
                  />
                )}
                
                <QuickAddIngredients 
                  mealType={mealType} 
                  onAddIngredient={onAddIngredient} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

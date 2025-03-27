
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MealType } from '../RecipeDialog';

interface QuickAddIngredientsProps {
  mealType: MealType;
  onAddIngredient: (mealType: MealType, ingredient: string) => void;
}

export function QuickAddIngredients({ mealType, onAddIngredient }: QuickAddIngredientsProps) {
  const commonIngredients: Record<MealType, string[]> = {
    breakfast: ['Eggs', 'Oatmeal', 'Yogurt', 'Bread', 'Avocado', 'Bacon', 'Fruit'],
    lunch: ['Chicken', 'Salad', 'Sandwich', 'Soup', 'Rice', 'Vegetables', 'Tuna'],
    dinner: ['Steak', 'Pasta', 'Fish', 'Potatoes', 'Curry', 'Rice', 'Vegetables'],
    snack: ['Nuts', 'Fruit', 'Yogurt', 'Chips', 'Popcorn', 'Chocolate', 'Granola']
  };

  return (
    <div>
      <div className="text-sm font-medium mb-2">Quick add:</div>
      <div className="flex flex-wrap gap-2">
        {commonIngredients[mealType].map((ingredient) => (
          <Badge
            key={ingredient}
            variant="outline"
            className="cursor-pointer bg-transparent hover:bg-gray-100 py-1.5 px-3"
            onClick={() => onAddIngredient(mealType, ingredient)}
          >
            {ingredient}
          </Badge>
        ))}
      </div>
    </div>
  );
}

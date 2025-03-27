
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { MealType } from '../RecipeDialog';

interface IngredientsListProps {
  mealType: MealType;
  ingredients: string[];
  onRemoveIngredient: (mealType: MealType, ingredient: string) => void;
}

export function IngredientsList({ mealType, ingredients, onRemoveIngredient }: IngredientsListProps) {
  const getMealTypeLabel = (type: MealType): string => {
    const labels = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack'
    };
    return labels[type];
  };

  return (
    <div className="mb-4">
      <div className="text-sm font-medium mb-2">{getMealTypeLabel(mealType)} ingredients:</div>
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient) => (
          <Badge 
            key={ingredient} 
            variant="secondary"
            className="pl-3 pr-2 py-1.5 flex items-center gap-1 bg-souschef-red/10 hover:bg-souschef-red/15 text-souschef-red border-souschef-red/20"
          >
            {ingredient}
            <button
              onClick={() => onRemoveIngredient(mealType, ingredient)}
              className="ml-1 rounded-full hover:bg-souschef-red/20 p-0.5"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

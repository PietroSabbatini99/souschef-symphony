
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MealType } from '../RecipeDialog';

interface IngredientInputProps {
  mealType: MealType;
  onAddIngredient: (mealType: MealType, ingredient: string) => void;
}

export function IngredientInput({ mealType, onAddIngredient }: IngredientInputProps) {
  const [ingredient, setIngredient] = useState('');

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      onAddIngredient(mealType, ingredient.trim());
      setIngredient('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

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
    <div className="flex gap-2">
      <Input
        value={ingredient}
        onChange={(e) => setIngredient(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Add ingredient for ${getMealTypeLabel(mealType).toLowerCase()}`}
        className="h-10"
      />
      <Button 
        onClick={handleAddIngredient}
        className="h-10 px-3 bg-souschef-red hover:bg-souschef-red-light text-white"
      >
        <Plus size={18} />
      </Button>
    </div>
  );
}

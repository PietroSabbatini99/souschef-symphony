
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Coffee, Utensils, ChefHat, Apple } from 'lucide-react';
import { MealType } from '../RecipeDialog';

interface MealTypeToggleProps {
  mealType: MealType;
  isSelected: boolean;
  onToggle: () => void;
}

export function MealTypeToggle({ mealType, isSelected, onToggle }: MealTypeToggleProps) {
  const getMealTypeConfig = (type: MealType) => {
    switch (type) {
      case 'breakfast':
        return { label: 'Breakfast', icon: <Coffee size={16} /> };
      case 'lunch':
        return { label: 'Lunch', icon: <Utensils size={16} /> };
      case 'dinner':
        return { label: 'Dinner', icon: <ChefHat size={16} /> };
      case 'snack':
        return { label: 'Snack', icon: <Apple size={16} /> };
    }
  };

  const { label, icon } = getMealTypeConfig(mealType);

  return (
    <Toggle
      variant="red"
      pressed={isSelected}
      onPressedChange={onToggle}
      className="w-full sm:w-auto flex items-center gap-2 border border-gray-200"
    >
      {icon}
      <span>{label}</span>
    </Toggle>
  );
}

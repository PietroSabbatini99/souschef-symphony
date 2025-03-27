
import { useState } from 'react';
import { MealType } from '@/components/dashboard/RecipeDialog';

export function useMealTypeIngredients() {
  const [mealTypeIngredients, setMealTypeIngredients] = useState<Record<MealType, string[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>(['dinner']);

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

  return {
    mealTypeIngredients,
    selectedMealTypes,
    handleToggleMealType,
    handleAddMealTypeIngredient,
    handleRemoveMealTypeIngredient
  };
}

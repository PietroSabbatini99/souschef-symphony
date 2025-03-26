
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Plus, Coffee, Utensils, ChefHat } from 'lucide-react';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface MealTypeSelectorProps {
  selectedMealTypes: MealType[];
  onToggleMealType: (mealType: MealType) => void;
  onAddIngredient: (mealType: MealType, ingredient: string) => void;
}

export function MealTypeSelector({
  selectedMealTypes,
  onToggleMealType,
  onAddIngredient
}: MealTypeSelectorProps) {
  const [ingredientInputs, setIngredientInputs] = useState<Record<MealType, string>>({
    breakfast: '',
    lunch: '',
    dinner: '',
    snack: ''
  });

  const handleAddIngredient = (mealType: MealType) => {
    if (ingredientInputs[mealType].trim()) {
      onAddIngredient(mealType, ingredientInputs[mealType].trim());
      setIngredientInputs(prev => ({
        ...prev,
        [mealType]: ''
      }));
    }
  };

  const handleInputChange = (mealType: MealType, value: string) => {
    setIngredientInputs(prev => ({
      ...prev,
      [mealType]: value
    }));
  };

  const handleKeyDown = (mealType: MealType, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient(mealType);
    }
  };

  const mealTypeConfigs = [
    { type: 'breakfast' as MealType, label: 'Breakfast', icon: <Coffee size={16} /> },
    { type: 'lunch' as MealType, label: 'Lunch', icon: <Utensils size={16} /> },
    { type: 'dinner' as MealType, label: 'Dinner', icon: <ChefHat size={16} /> },
    { type: 'snack' as MealType, label: 'Snack', icon: <Coffee size={16} /> }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold mb-4">Meal Types</h2>
      
      <div className="space-y-6">
        {mealTypeConfigs.map(({ type, label, icon }) => (
          <div key={type} className="space-y-2">
            <Toggle
              variant="red"
              pressed={selectedMealTypes.includes(type)}
              onPressedChange={() => onToggleMealType(type)}
              className="w-full sm:w-auto flex items-center gap-2 border border-gray-200"
            >
              {icon}
              <span>{label}</span>
            </Toggle>
            
            {selectedMealTypes.includes(type) && (
              <div className="flex gap-2">
                <Input
                  value={ingredientInputs[type]}
                  onChange={(e) => handleInputChange(type, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(type, e)}
                  placeholder={`Add main ingredient for ${label.toLowerCase()}`}
                  className="h-10"
                />
                <Button 
                  onClick={() => handleAddIngredient(type)}
                  className="h-10 px-3 bg-souschef-red hover:bg-souschef-red-light text-white"
                >
                  <Plus size={18} />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

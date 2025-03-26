
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Coffee, Utensils, ChefHat } from 'lucide-react';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

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

  const commonIngredients: Record<MealType, string[]> = {
    breakfast: ['Eggs', 'Oatmeal', 'Yogurt', 'Bread', 'Avocado', 'Bacon', 'Fruit'],
    lunch: ['Chicken', 'Salad', 'Sandwich', 'Soup', 'Rice', 'Vegetables', 'Tuna'],
    dinner: ['Steak', 'Pasta', 'Fish', 'Potatoes', 'Curry', 'Rice', 'Vegetables'],
    snack: ['Nuts', 'Fruit', 'Yogurt', 'Chips', 'Popcorn', 'Chocolate', 'Granola']
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
          <div key={type} className="space-y-4 p-4 border border-gray-200 rounded-lg">
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
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={ingredientInputs[type]}
                    onChange={(e) => handleInputChange(type, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(type, e)}
                    placeholder={`Add ingredient for ${label.toLowerCase()}`}
                    className="h-10"
                  />
                  <Button 
                    onClick={() => handleAddIngredient(type)}
                    className="h-10 px-3 bg-souschef-red hover:bg-souschef-red-light text-white"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
                
                {mealTypeIngredients[type] && mealTypeIngredients[type].length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">{label} ingredients:</div>
                    <div className="flex flex-wrap gap-2">
                      {mealTypeIngredients[type].map((ingredient) => (
                        <Badge 
                          key={ingredient} 
                          variant="secondary"
                          className="pl-3 pr-2 py-1.5 flex items-center gap-1 bg-souschef-red/10 hover:bg-souschef-red/15 text-souschef-red border-souschef-red/20"
                        >
                          {ingredient}
                          <button
                            onClick={() => onRemoveIngredient(type, ingredient)}
                            className="ml-1 rounded-full hover:bg-souschef-red/20 p-0.5"
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm font-medium mb-2">Quick add:</div>
                  <div className="flex flex-wrap gap-2">
                    {commonIngredients[type].map((ingredient) => (
                      <Badge
                        key={ingredient}
                        variant="outline"
                        className="cursor-pointer bg-transparent hover:bg-gray-100 py-1.5 px-3"
                        onClick={() => onAddIngredient(type, ingredient)}
                      >
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

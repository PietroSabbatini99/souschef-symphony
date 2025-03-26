
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface IngredientSelectorProps {
  selectedIngredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
}

export function IngredientSelector({ 
  selectedIngredients, 
  onAddIngredient, 
  onRemoveIngredient 
}: IngredientSelectorProps) {
  const [ingredientInput, setIngredientInput] = useState('');

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      onAddIngredient(ingredientInput.trim());
      setIngredientInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const commonIngredients = [
    'Chicken', 'Rice', 'Pasta', 'Beef', 'Fish',
    'Tofu', 'Tomatoes', 'Potatoes', 'Onions', 'Garlic'
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Customize Ingredients</h2>
      
      <div className="flex gap-2 mb-4">
        <Input
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add main ingredient"
          className="h-10"
        />
        <Button 
          onClick={handleAddIngredient}
          className="h-10 px-3 bg-souschef-red hover:bg-souschef-red-light text-white"
        >
          <Plus size={18} />
        </Button>
      </div>
      
      {selectedIngredients.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Selected ingredients:</div>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ingredient) => (
              <Badge 
                key={ingredient} 
                variant="secondary"
                className="pl-3 pr-2 py-1.5 flex items-center gap-1 bg-souschef-red/10 hover:bg-souschef-red/15 text-souschef-red border-souschef-red/20"
              >
                {ingredient}
                <button
                  onClick={() => onRemoveIngredient(ingredient)}
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
          {commonIngredients.map((ingredient) => (
            <Badge
              key={ingredient}
              variant="outline"
              className="cursor-pointer bg-transparent hover:bg-gray-100 py-1.5 px-3"
              onClick={() => onAddIngredient(ingredient)}
            >
              {ingredient}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

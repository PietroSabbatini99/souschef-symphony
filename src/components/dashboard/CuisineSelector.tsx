
import React from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Coffee, ChefHat } from 'lucide-react';

export type CuisineLevel = 'street' | 'home' | 'gourmet';

interface CuisineSelectorProps {
  selectedLevel: CuisineLevel | null;
  onSelect: (level: CuisineLevel) => void;
}

export function CuisineSelector({ selectedLevel, onSelect }: CuisineSelectorProps) {
  const cuisineLevels = [
    { 
      id: 'street', 
      name: 'Street Food', 
      description: 'Quick, casual recipes with bold flavors', 
      icon: <Coffee className="w-6 h-6" /> 
    },
    { 
      id: 'home', 
      name: 'Home Cooking', 
      description: 'Balanced, family-friendly meals for everyday', 
      icon: <Utensils className="w-6 h-6" /> 
    },
    { 
      id: 'gourmet', 
      name: 'Gourmet', 
      description: 'Elevated recipes to impress with refined techniques', 
      icon: <ChefHat className="w-6 h-6" /> 
    }
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Select Cuisine Style</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cuisineLevels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id as CuisineLevel)}
            className={`h-full transition-all duration-300 flex flex-col items-center text-center p-6 rounded-xl border ${
              selectedLevel === level.id 
                ? 'border-souschef-red bg-souschef-red/5 shadow-md' 
                : 'border-gray-200 bg-white hover:border-souschef-red/30 hover:shadow-sm'
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
              selectedLevel === level.id 
                ? 'bg-souschef-red text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {level.icon}
            </div>
            <h3 className="text-lg font-medium mb-1">{level.name}</h3>
            <p className="text-sm text-gray-500">{level.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

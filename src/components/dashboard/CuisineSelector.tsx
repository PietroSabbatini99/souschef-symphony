
import React from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, ChefHat } from 'lucide-react';

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
      icon: (
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-6 h-6"
        >
          <path d="M3 18h18v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2z" />
          <path d="M19 10V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5" />
          <path d="M8 8h8" />
          <path d="M9 4v4" />
          <path d="M15 4v4" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
          <path d="M 7 8 a 6 3 0 0 1 10 0" />
        </svg>
      )
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

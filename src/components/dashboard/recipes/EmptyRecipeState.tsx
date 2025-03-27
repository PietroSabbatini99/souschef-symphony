
import React from 'react';
import { ChefHat, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyRecipeStateProps {
  onCreateRecipe: () => void;
}

export function EmptyRecipeState({ onCreateRecipe }: EmptyRecipeStateProps) {
  return (
    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
      <ChefHat size={48} className="mx-auto text-gray-300 mb-3" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes yet</h3>
      <p className="text-gray-500 mb-6">Create your first recipe or generate one with AI</p>
      <Button onClick={onCreateRecipe} className="bg-souschef-red hover:bg-souschef-red-light text-white">
        <PlusCircle size={18} className="mr-2" />
        Create Recipe
      </Button>
    </div>
  );
}


import React from 'react';
import { RecipeCard } from '../RecipeCard';
import { Recipe } from './types';

interface RecipeListProps {
  recipes: Recipe[];
  onRecipeDeleted: () => void;
  onViewRecipe: (id: string) => void;
  getCuisineLevel: (recipe: Recipe) => 'street' | 'home' | 'gourmet';
  getIngredientsList: (ingredients: Record<string, any> | string | any[]) => string[];
}

export function RecipeList({ 
  recipes, 
  onRecipeDeleted, 
  onViewRecipe,
  getCuisineLevel,
  getIngredientsList
}: RecipeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map(recipe => (
        <RecipeCard 
          key={recipe.id}
          id={recipe.id}
          title={recipe.title}
          description={recipe.description || ''}
          imageUrl={recipe.image_url || 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1080&auto=format&fit=crop'}
          cookingTime={recipe.cooking_time ? `${recipe.cooking_time} mins` : '30 mins'}
          level={getCuisineLevel(recipe)}
          ingredients={getIngredientsList(recipe.ingredients)}
          onDeleted={onRecipeDeleted}
          onView={onViewRecipe}
        />
      ))}
    </div>
  );
}

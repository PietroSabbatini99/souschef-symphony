
import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Recipe } from './types';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
  getCuisineLevel: (recipe: Recipe) => 'street' | 'home' | 'gourmet';
  getIngredientsList: (ingredients: Record<string, any> | string | any[]) => string[];
}

export function RecipeDetailView({ 
  recipe, 
  onBack,
  getCuisineLevel,
  getIngredientsList
}: RecipeDetailViewProps) {
  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={onBack}
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to recipes
        </Button>
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{recipe.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                {getIngredientsList(recipe.ingredients).map((ingredient, index) => (
                  <li key={index} className="text-gray-600">{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Instructions</h3>
              <div className="space-y-3 text-gray-600">
                {recipe.instructions.split('\n').map((instruction, index) => (
                  <p key={index}>{instruction}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">Recipe Details</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Cuisine Style</div>
                <Badge 
                  variant="outline" 
                  className={`
                    ${getCuisineLevel(recipe) === 'street' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                    ${getCuisineLevel(recipe) === 'home' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                    ${getCuisineLevel(recipe) === 'gourmet' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                  `}
                >
                  {getCuisineLevel(recipe) === 'street' ? 'Street Food' : 
                   getCuisineLevel(recipe) === 'home' ? 'Home Cooking' : 'Gourmet'}
                </Badge>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Difficulty</div>
                <div className="font-medium">
                  {recipe.difficulty === 'easy' ? 'Easy' : 
                   recipe.difficulty === 'medium' ? 'Medium' : 'Hard'}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Cooking Time</div>
                <div className="font-medium flex items-center">
                  <Clock size={16} className="mr-2 text-gray-500" />
                  {recipe.cooking_time} minutes
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Created</div>
                <div className="text-gray-600">
                  {new Date(recipe.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

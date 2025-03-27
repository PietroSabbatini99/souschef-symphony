
import { Recipe } from './types';

export const getCuisineLevel = (recipe: Recipe): 'street' | 'home' | 'gourmet' => {
  if (recipe.cuisine && ['street', 'home', 'gourmet'].includes(recipe.cuisine)) {
    return recipe.cuisine as 'street' | 'home' | 'gourmet';
  }
  
  switch (recipe.difficulty) {
    case 'easy':
      return 'street';
    case 'medium':
      return 'home';
    case 'hard':
      return 'gourmet';
    default:
      return 'home';
  }
};

export const getIngredientsList = (ingredients: Record<string, any> | string | any[]): string[] => {
  if (!ingredients) return [];
  try {
    if (typeof ingredients === 'string') {
      const parsed = JSON.parse(ingredients);
      return Array.isArray(parsed) ? parsed : Object.keys(parsed);
    }
    return Array.isArray(ingredients) ? ingredients : Object.keys(ingredients);
  } catch (e) {
    console.error('Error parsing ingredients:', e);
    return [];
  }
};

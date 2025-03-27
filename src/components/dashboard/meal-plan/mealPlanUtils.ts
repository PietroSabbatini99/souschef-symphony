
import { Json } from '@/integrations/supabase/types';
import { MealPlan } from './types';

export const getCuisineLevel = (recipe: MealPlan['recipe']): 'street' | 'home' | 'gourmet' => {
  // First check if cuisine is explicitly set to one of our recognized levels
  if (recipe.cuisine && ['street', 'home', 'gourmet'].includes(recipe.cuisine)) {
    return recipe.cuisine as 'street' | 'home' | 'gourmet';
  }
  
  // If not, fall back to mapping from difficulty
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

export const getIngredientsList = (ingredients: Json): string[] => {
  if (!ingredients) return [];
  
  try {
    if (typeof ingredients === 'string') {
      const parsed = JSON.parse(ingredients);
      return Array.isArray(parsed) ? parsed : Object.keys(parsed);
    }
    
    if (Array.isArray(ingredients)) {
      return ingredients.map(item => String(item));
    } else if (typeof ingredients === 'object') {
      return Object.keys(ingredients);
    }
    
    return [];
  } catch (e) {
    console.error('Error parsing ingredients:', e);
    return [];
  }
};

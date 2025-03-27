
import { Json } from '@/integrations/supabase/types';

export interface MealPlanViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export interface MealPlan {
  id: string;
  recipe_id: string;
  planned_date: string;
  meal_type: string;
  recipe: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    cooking_time: number;
    difficulty: string;
    cuisine: string;
    ingredients: Json;
  };
}

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

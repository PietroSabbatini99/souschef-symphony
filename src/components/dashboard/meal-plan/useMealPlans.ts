
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MealPlan } from './types';

export function useMealPlans(selectedDate: Date) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMealPlans() {
      try {
        setLoading(true);
        
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        
        const { data, error } = await supabase
          .from('meal_plans')
          .select(`
            id,
            recipe_id,
            planned_date,
            meal_type,
            recipe:recipes(
              id,
              title,
              description,
              image_url,
              cooking_time,
              difficulty,
              cuisine,
              ingredients
            )
          `)
          .eq('planned_date', formattedDate);
          
        if (error) throw error;
        
        setMealPlans(data || []);
      } catch (error) {
        console.error('Error fetching meal plans:', error);
        toast.error('Failed to load meal plans');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMealPlans();
  }, [selectedDate]);

  return { mealPlans, loading };
}

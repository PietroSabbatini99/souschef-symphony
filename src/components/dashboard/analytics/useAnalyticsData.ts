
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DietaryPreferences, ChartDataPoint } from './types';

export function useAnalyticsData() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<DietaryPreferences>({
    allergens: [],
  });
  const [calorieData, setCalorieData] = useState<ChartDataPoint[]>([]);

  // Sample data for demonstration
  const cuisineData = [
    { name: 'Italian', value: 8 },
    { name: 'Mexican', value: 5 },
    { name: 'Chinese', value: 4 },
    { name: 'Indian', value: 3 },
    { name: 'Thai', value: 2 },
  ];

  const mealTypesData = [
    { name: 'Breakfast', value: 6 },
    { name: 'Lunch', value: 9 },
    { name: 'Dinner', value: 12 },
    { name: 'Snack', value: 3 },
  ];

  const weeklyActivityData = [
    { day: 'Mon', recipes: 2, meals: 3, calories: 2100 },
    { day: 'Tue', recipes: 1, meals: 2, calories: 1900 },
    { day: 'Wed', recipes: 0, meals: 3, calories: 2200 },
    { day: 'Thu', recipes: 3, meals: 3, calories: 2000 },
    { day: 'Fri', recipes: 1, meals: 2, calories: 1850 },
    { day: 'Sat', recipes: 4, meals: 4, calories: 2400 },
    { day: 'Sun', recipes: 2, meals: 3, calories: 2150 },
  ];

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('dietary_preferences')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data && data.dietary_preferences) {
          // Convert from string[] to DietaryPreferences object if needed
          if (Array.isArray(data.dietary_preferences)) {
            console.log('Received array data, converting to object');
            // Handle old format (array) - convert to object
            setUserPreferences({
              allergens: data.dietary_preferences as string[]
            });
          } else {
            // Already in object format
            const preferences = data.dietary_preferences as DietaryPreferences;
            
            setUserPreferences({
              dailyCalorieGoal: preferences.dailyCalorieGoal,
              weeklyCalorieGoal: preferences.weeklyCalorieGoal,
              allergens: Array.isArray(preferences.allergens) ? preferences.allergens : [],
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };
    
    const fetchCalorieData = async () => {
      if (!user) return;
      
      try {
        // Get current date
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
        
        // Format date to YYYY-MM-DD for Supabase query
        const formatDate = (date: Date) => {
          return date.toISOString().split('T')[0];
        };
        
        // Get all meal plans for the current week
        const { data: mealPlans, error: mealPlansError } = await supabase
          .from('meal_plans')
          .select(`
            planned_date,
            recipe:recipes(
              title,
              calories_per_serving
            )
          `)
          .gte('planned_date', formatDate(startOfWeek))
          .lt('planned_date', formatDate(new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)))
          .eq('user_id', user.id);
          
        if (mealPlansError) throw mealPlansError;
        
        if (mealPlans && mealPlans.length > 0) {
          // Group by date and sum calories
          const dailyCalories: Record<string, number> = {};
          
          mealPlans.forEach(plan => {
            const date = plan.planned_date;
            const calories = plan.recipe?.calories_per_serving || 0;
            
            if (!dailyCalories[date]) {
              dailyCalories[date] = 0;
            }
            
            dailyCalories[date] += calories;
          });
          
          // Convert to array for chart
          const calorieChartData = Object.entries(dailyCalories).map(([date, calories]) => {
            const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            return {
              day,
              calories,
              name: day
            };
          });
          
          setCalorieData(calorieChartData);
        } else {
          // Use sample data if no meal plans found
          setCalorieData(weeklyActivityData.map(item => ({
            day: item.day,
            calories: item.calories,
            name: item.day
          })));
        }
      } catch (error) {
        console.error('Error fetching calorie data:', error);
        // Fallback to sample data
        setCalorieData(weeklyActivityData.map(item => ({
          day: item.day,
          calories: item.calories,
          name: item.day
        })));
      }
    };
    
    fetchUserPreferences();
    fetchCalorieData();
  }, [user]);

  const handleSavePreferences = async (values: any) => {
    if (!user) {
      return { success: false, error: "You must be logged in to save preferences" };
    }
    
    setIsLoading(true);
    
    try {
      // Process allergens into array
      const allergensArray = values.allergens
        ? values.allergens.split(',').map((item: string) => item.trim()).filter((item: string) => item)
        : [];
      
      // Prepare the dietary preferences object
      const dietaryPreferences: DietaryPreferences = {
        dailyCalorieGoal: values.dailyCalories ? parseInt(values.dailyCalories.toString()) : undefined,
        weeklyCalorieGoal: values.weeklyCalorieGoal ? parseInt(values.weeklyCalorieGoal.toString()) : undefined,
        allergens: allergensArray,
      };
      
      console.log('Saving preferences:', dietaryPreferences);
      
      // Update the profile - convert object to JSON string for storage
      // This is necessary because Supabase expects dietary_preferences to be stored as JSON
      const { error } = await supabase
        .from('profiles')
        .update({
          dietary_preferences: dietaryPreferences, // Store as JSON object, not as string[]
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Update local state
      setUserPreferences(dietaryPreferences);
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Error saving preferences:', error);
      setIsLoading(false);
      return { success: false, error: 'Failed to save preferences' };
    }
  };

  return {
    isLoading,
    userPreferences,
    calorieData,
    cuisineData,
    mealTypesData,
    weeklyActivityData,
    handleSavePreferences
  };
}

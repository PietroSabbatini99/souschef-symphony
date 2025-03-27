
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Import analytics components
import { AnalyticsHeader } from './analytics/AnalyticsHeader';
import { CalorieTrackingChart } from './analytics/CalorieTrackingChart';
import { CuisineDistributionChart } from './analytics/CuisineDistributionChart';
import { MealTypesChart } from './analytics/MealTypesChart';
import { NutritionGoalsCard } from './analytics/NutritionGoalsCard';
import { PreferencesForm } from './analytics/PreferencesForm';
import { WeeklyActivityChart } from './analytics/WeeklyActivityChart';

// Import types
import { 
  DietaryPreferences, 
  ChartDataPoint, 
  CuisineDataPoint, 
  MealTypeDataPoint,
  UserPreferencesFormValues
} from './analytics/types';

// Colors for charts
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];

export function AnalyticsView() {
  const { user } = useAuth();
  const [tabView, setTabView] = useState('insights');
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<DietaryPreferences>({
    allergens: [],
  });
  const [calorieData, setCalorieData] = useState<ChartDataPoint[]>([]);
  
  // Cuisine and meal type data (this can be fetched from the API in a real scenario)
  const cuisineData: CuisineDataPoint[] = [
    { name: 'Italian', value: 8 },
    { name: 'Mexican', value: 5 },
    { name: 'Chinese', value: 4 },
    { name: 'Indian', value: 3 },
    { name: 'Thai', value: 2 },
  ];

  const mealTypesData: MealTypeDataPoint[] = [
    { name: 'Breakfast', count: 6 },
    { name: 'Lunch', count: 9 },
    { name: 'Dinner', count: 12 },
    { name: 'Snack', count: 3 },
  ];

  // Weekly activity data with recipes, meals, and calories
  const weeklyActivityData = [
    { day: 'Mon', recipes: 2, meals: 3, calories: 2100 },
    { day: 'Tue', recipes: 1, meals: 2, calories: 1900 },
    { day: 'Wed', recipes: 0, meals: 3, calories: 2200 },
    { day: 'Thu', recipes: 3, meals: 3, calories: 2000 },
    { day: 'Fri', recipes: 1, meals: 2, calories: 1850 },
    { day: 'Sat', recipes: 4, meals: 4, calories: 2400 },
    { day: 'Sun', recipes: 2, meals: 3, calories: 2150 },
  ];

  // Fetch user preferences and calorie data
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
          const preferences = data.dietary_preferences as DietaryPreferences;
          
          setUserPreferences({
            dailyCalorieGoal: preferences.dailyCalorieGoal,
            weeklyCalorieGoal: preferences.weeklyCalorieGoal,
            allergens: Array.isArray(preferences.allergens) ? preferences.allergens : [],
          });
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
          setCalorieData(weeklyActivityData as ChartDataPoint[]);
        }
      } catch (error) {
        console.error('Error fetching calorie data:', error);
        // Fallback to sample data
        setCalorieData(weeklyActivityData as ChartDataPoint[]);
      }
    };
    
    fetchUserPreferences();
    fetchCalorieData();
  }, [user]);

  const handleUpdatePreferences = () => {
    setTabView('preferences');
  };

  const handleSubmitPreferences = async (values: UserPreferencesFormValues) => {
    if (!user) {
      toast.error("You must be logged in to save preferences");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Process allergens into array
      const allergensArray = values.allergens
        ? values.allergens.split(',').map(item => item.trim()).filter(item => item)
        : [];
      
      // Prepare the dietary preferences object
      const dietaryPreferences: DietaryPreferences = {
        dailyCalorieGoal: values.dailyCalories ? parseInt(values.dailyCalories.toString()) : undefined,
        weeklyCalorieGoal: values.weeklyCalorieGoal ? parseInt(values.weeklyCalorieGoal.toString()) : undefined,
        allergens: allergensArray,
      };
      
      // Update the profile
      const { error } = await supabase
        .from('profiles')
        .update({
          dietary_preferences: dietaryPreferences,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUserPreferences(dietaryPreferences);
      
      toast.success('Preferences saved successfully');
      
      // Switch back to insights tab
      setTabView('insights');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <AnalyticsHeader />
      
      <Tabs 
        defaultValue="insights" 
        value={tabView} 
        onValueChange={setTabView}
        className="mb-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CalorieTrackingChart 
              data={calorieData} 
              dailyCalorieGoal={userPreferences.dailyCalorieGoal as number} 
            />
            
            <CuisineDistributionChart 
              data={cuisineData} 
              colors={COLORS} 
            />
            
            <MealTypesChart data={mealTypesData} />
            
            <NutritionGoalsCard 
              userPreferences={userPreferences} 
              onUpdatePreferences={handleUpdatePreferences} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-6">
          <PreferencesForm
            initialPreferences={userPreferences}
            onSubmit={handleSubmitPreferences}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
      
      <WeeklyActivityChart data={weeklyActivityData as any} />
    </div>
  );
}

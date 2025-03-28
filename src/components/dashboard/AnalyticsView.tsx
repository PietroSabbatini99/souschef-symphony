
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import analytics components
import { AnalyticsHeader } from './analytics/AnalyticsHeader';
import { CalorieTrackingChart } from './analytics/CalorieTrackingChart';
import { CuisineDistributionChart } from './analytics/CuisineDistributionChart';
import { MealTypesChart } from './analytics/MealTypesChart';
import { NutritionGoalsCard } from './analytics/NutritionGoalsCard';
import { PreferencesForm } from './analytics/PreferencesForm';
import { WeeklyActivityChart } from './analytics/WeeklyActivityChart';
import { useAnalyticsData } from './analytics/useAnalyticsData';

// Colors for charts
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];

export function AnalyticsView() {
  const [tabView, setTabView] = useState('insights');
  const { 
    isLoading,
    userPreferences,
    calorieData,
    cuisineData,
    mealTypesData,
    weeklyActivityData,
    handleSavePreferences
  } = useAnalyticsData();

  const handleUpdatePreferences = () => {
    setTabView('preferences');
  };

  const handleSubmitPreferences = async (values: any) => {
    const result = await handleSavePreferences(values);
    
    if (result.success) {
      toast.success('Preferences saved successfully');
      setTabView('insights');
    } else {
      toast.error(result.error || 'Failed to save preferences');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
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
              data={calorieData.map(item => ({
                day: item.day || '',
                calories: item.calories || 0
              }))} 
              dailyCalorieGoal={userPreferences.dailyCalorieGoal} 
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
      
      <WeeklyActivityChart data={weeklyActivityData} />
    </div>
  );
}

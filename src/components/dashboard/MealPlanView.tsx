
import React from 'react';
import { MealPlanViewProps } from './meal-plan/types';
import { WeekCalendar } from './meal-plan/WeekCalendar';
import { MealPlanContent } from './meal-plan/MealPlanContent';
import { useMealPlans } from './meal-plan/useMealPlans';
import { useIsMobile } from '@/hooks/use-mobile';

export function MealPlanView({ selectedDate, onDateChange }: MealPlanViewProps) {
  const { mealPlans, loading } = useMealPlans(selectedDate);
  const isMobile = useIsMobile();

  return (
    <div className="w-full px-0 md:px-4">
      <WeekCalendar 
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />
      
      <MealPlanContent
        selectedDate={selectedDate}
        mealPlans={mealPlans}
        loading={loading}
      />
    </div>
  );
}

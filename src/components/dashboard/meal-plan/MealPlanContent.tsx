
import React from 'react';
import { RecipeCard } from '../RecipeCard';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyMealPlan } from './EmptyMealPlan';
import { MealPlan } from './types';
import { getCuisineLevel, getIngredientsList } from './mealPlanUtils';

interface MealPlanContentProps {
  selectedDate: Date;
  mealPlans: MealPlan[];
  loading: boolean;
}

export function MealPlanContent({ selectedDate, mealPlans, loading }: MealPlanContentProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="w-2/3 h-6 mb-2" />
              <Skeleton className="w-full h-4 mb-1" />
              <Skeleton className="w-full h-4 mb-4" />
              <Skeleton className="w-1/3 h-4 mb-2" />
              <Skeleton className="w-full h-8 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6">
      {mealPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlans.map((mealPlan) => (
            <RecipeCard
              key={mealPlan.id}
              id={mealPlan.recipe.id}
              title={`${mealPlan.meal_type.charAt(0).toUpperCase() + mealPlan.meal_type.slice(1)}: ${mealPlan.recipe.title}`}
              description={mealPlan.recipe.description || ''}
              imageUrl={mealPlan.recipe.image_url || 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=1080&auto=format&fit=crop'}
              cookingTime={mealPlan.recipe.cooking_time ? `${mealPlan.recipe.cooking_time} mins` : '30 mins'}
              level={getCuisineLevel(mealPlan.recipe)}
              ingredients={getIngredientsList(mealPlan.recipe.ingredients)}
            />
          ))}
        </div>
      ) : (
        <EmptyMealPlan />
      )}
    </div>
  );
}

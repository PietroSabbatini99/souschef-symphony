
export interface DietaryPreferences {
  dailyCalorieGoal?: number;
  weeklyCalorieGoal?: number;
  allergens?: string[];
}

export interface ChartDataPoint {
  day: string;
  recipes: number;
  meals: number;
  calories: number;
  [key: string]: any;
}

export interface CuisineDataPoint {
  name: string;
  value: number;
}

export interface MealTypeDataPoint {
  name: string;
  count: number;
}

export type UserPreferencesFormValues = {
  dailyCalorieGoal: string;
  weeklyCalorieGoal: string;
  allergens: string;
};

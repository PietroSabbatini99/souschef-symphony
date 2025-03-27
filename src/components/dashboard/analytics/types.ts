
// This might already be in the codebase. If not, this will create it.
export interface DietaryPreferences {
  [key: string]: boolean | string | number | null | string[] | undefined;
  dailyCalorieGoal?: number;
  weeklyCalorieGoal?: number;
  allergens?: string[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  day?: string;
  recipes?: number;
  meals?: number;
  calories?: number;
}

export interface CuisineDataPoint {
  name: string;
  value: number;
}

export interface MealTypeDataPoint {
  name: string;
  count: number;
}

export interface UserPreferencesFormValues {
  dailyCalories: number;
  weeklyCalorieGoal?: number;
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
  allergens?: string;
}

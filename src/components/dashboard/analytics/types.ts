
// Chart data interfaces
export interface ChartDataPoint {
  name?: string;
  day?: string;
  value?: number;
  calories?: number;
  [key: string]: any;
}

// Dietary preferences interface
export interface DietaryPreferences {
  [key: string]: any;
  dailyCalorieGoal?: number;
  weeklyCalorieGoal?: number;
  allergens?: string[];
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  nutFree?: boolean;
  pescatarian?: boolean;
  keto?: boolean;
  paleo?: boolean;
  lowCarb?: boolean;
  lowFat?: boolean;
  caloriesGoal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
}

// Chart data interfaces
export interface CuisineDataPoint {
  name: string;
  value: number;
}

export interface MealTypeDataPoint {
  name: string;
  value: number;
  count?: number; // For backward compatibility
}

export interface WeeklyActivityDataPoint {
  day: string;
  recipes: number;
  meals: number;
  calories: number;
  [key: string]: any;
}

// Form values interface
export interface UserPreferencesFormValues {
  dailyCalories?: string;
  weeklyCalorieGoal?: string;
  allergens?: string;
  dietaryRestrictions?: string[];
  cuisinePreferences?: string[];
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  nutFree?: boolean;
  pescatarian?: boolean;
  keto?: boolean;
  paleo?: boolean;
  lowCarb?: boolean;
  lowFat?: boolean;
  caloriesGoal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
}

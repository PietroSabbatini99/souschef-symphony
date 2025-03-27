// Add the ChartDataPoint interface if it's not already defined
export interface ChartDataPoint {
  name?: string;
  day?: string;
  value?: number;
  calories?: number;
  [key: string]: any;
}

// Ensure DietaryPreferences is properly defined as a record type
export interface DietaryPreferences {
  [key: string]: any;
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

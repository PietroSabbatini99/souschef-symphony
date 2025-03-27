
// Configuration values for recipe generation

// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cuisine level descriptions mapping
export const cuisineStyleDescriptions = {
  street: "quick and casual street food style with bold flavors",
  home: "balanced, family-friendly home cooking style",
  gourmet: "elegant and refined gourmet style with sophisticated techniques"
};

// Realistic calorie ranges based on meal type
export const calorieGuidelines = {
  breakfast: "Breakfast dishes typically range from 300-500 calories per serving",
  lunch: "Lunch dishes typically range from 400-700 calories per serving",
  dinner: "Dinner dishes typically range from 500-800 calories per serving",
  snack: "Snacks typically range from 100-300 calories per serving"
};

// Default calorie fallbacks if missing from the recipe
export const defaultCalories = {
  breakfast: 400,
  lunch: 600,
  dinner: 700,
  snack: 200
};

// Calorie range limits by meal type to ensure realistic values
export const maxCaloriesByMealType = {
  breakfast: 800,
  lunch: 1000, 
  dinner: 1200,
  snack: 500
};

export const minCaloriesByMealType = {
  breakfast: 200,
  lunch: 300,
  dinner: 400,
  snack: 50
};

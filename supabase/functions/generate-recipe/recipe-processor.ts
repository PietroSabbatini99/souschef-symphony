
import { defaultCalories, maxCaloriesByMealType, minCaloriesByMealType } from "./config.ts";

// Process the OpenAI response to extract and validate recipe data
export function processRecipeResponse(content: string, mealType: string) {
  try {
    let recipe;
    
    // Handle both formats
    if (content.trim().startsWith('{')) {
      recipe = JSON.parse(content);
    } else {
      // Extract JSON objects from text if OpenAI didn't return proper JSON
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        recipe = JSON.parse(jsonMatch[0]);
      }
    }
    
    if (recipe) {
      // Ensure the meal_type is included in the recipe
      recipe.meal_type = mealType;
      
      // Ensure there's a realistic calories_per_serving field
      validateAndNormalizeCalories(recipe, mealType);
      
      return recipe;
    }
    
    return null;
  } catch (parseError) {
    console.error(`Error parsing OpenAI response for ${mealType}:`, parseError);
    throw new Error(`Failed to parse recipe data from OpenAI response for ${mealType}`);
  }
}

// Validate and normalize calorie counts to ensure they're realistic
function validateAndNormalizeCalories(recipe, mealType) {
  if (!recipe.calories_per_serving || isNaN(Number(recipe.calories_per_serving))) {
    // Default fallback based on meal type if missing
    recipe.calories_per_serving = defaultCalories[mealType] || 500;
  } else {
    // Ensure it's a number
    recipe.calories_per_serving = Number(recipe.calories_per_serving);
    
    // Check if the calorie count seems unrealistic and adjust if needed
    const maxCalories = maxCaloriesByMealType[mealType] || 1000;
    const minCalories = minCaloriesByMealType[mealType] || 200;
    
    if (recipe.calories_per_serving > maxCalories) {
      console.log(`Adjusting unrealistically high calorie count from ${recipe.calories_per_serving} to ${maxCalories}`);
      recipe.calories_per_serving = maxCalories;
    }
    
    if (recipe.calories_per_serving < minCalories) {
      console.log(`Adjusting unrealistically low calorie count from ${recipe.calories_per_serving} to ${minCalories}`);
      recipe.calories_per_serving = minCalories;
    }
  }
}

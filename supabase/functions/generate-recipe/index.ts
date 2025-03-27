
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, cuisineStyleDescriptions } from "./config.ts";
import { generateRecipePrompt, generateRecipeWithOpenAI } from "./openai-service.ts";
import { processRecipeResponse } from "./recipe-processor.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      cuisineLevel, 
      ingredients = {},
      mealTypes = ["dinner"],
      count = 1,
      dietaryPreferences = {}
    } = await req.json();

    if (!cuisineLevel) {
      throw new Error("Cuisine level is required");
    }

    // Get the style description based on cuisine level
    const styleDescription = cuisineStyleDescriptions[cuisineLevel] || cuisineStyleDescriptions.home;
    
    // Generate a separate recipe for each meal type
    const allRecipes = [];
    
    // Process each meal type
    for (const mealType of mealTypes) {
      console.log(`Generating recipe for meal type: ${mealType}`);
      
      let mealIngredients = ingredients[mealType] || [];
      
      // Always generate a recipe, even if no specific ingredients are provided
      let promptIngredients = "using common ingredients";
      if (mealIngredients.length > 0) {
        promptIngredients = `using the following ingredients: ${mealIngredients.join(", ")}`;
      }

      // Add dietary preferences to the prompt
      let dietaryConstraints = "";
      if (dietaryPreferences.dailyCalorieGoal) {
        dietaryConstraints += ` The recipe should fit within a daily calorie goal of ${dietaryPreferences.dailyCalorieGoal} calories.`;
      }
      
      if (dietaryPreferences.allergens && dietaryPreferences.allergens.length > 0) {
        dietaryConstraints += ` Strictly avoid the following allergens: ${dietaryPreferences.allergens.join(", ")}.`;
      }

      // Generate recipe prompt and get response from OpenAI
      const systemPrompt = generateRecipePrompt(
        mealType, 
        styleDescription, 
        promptIngredients, 
        dietaryConstraints
      );

      const userPrompt = `Create a ${cuisineLevel} ${mealType} recipe ${promptIngredients}${dietaryConstraints}. Be accurate and realistic with calorie calculations.`;
      
      const openAIResponse = await generateRecipeWithOpenAI(systemPrompt, userPrompt, mealType);
      
      // Process the response to extract recipe
      const recipe = processRecipeResponse(openAIResponse, mealType);
      
      if (recipe) {
        allRecipes.push(recipe);
      }
    }

    // Make sure we have at least one recipe
    if (allRecipes.length === 0) {
      throw new Error("Failed to generate any recipes. Please try again.");
    }

    return new Response(JSON.stringify({ recipes: allRecipes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in generate-recipe function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

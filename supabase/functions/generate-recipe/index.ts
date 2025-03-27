
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Map cuisine level to style descriptions
    const cuisineStyleDescriptions = {
      street: "quick and casual street food style with bold flavors",
      home: "balanced, family-friendly home cooking style",
      gourmet: "elegant and refined gourmet style with sophisticated techniques"
    };

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

      // Construct recipe generation prompt for this meal type
      const systemPrompt = `You are a professional chef specialized in creating ${styleDescription} recipes. Generate a ${mealType} recipe ${promptIngredients}.${dietaryConstraints}

For the recipe name:
- If cuisine level is "street": Create a catchy, simple name
- If cuisine level is "home": Create a straightforward, approachable name
- If cuisine level is "gourmet": Create an elegant, sophisticated name

Important: ALWAYS include an accurate calories_per_serving estimate for the recipe.

Provide the following JSON structure:
{
  "title": "Recipe Title",
  "description": "Brief appetizing description of the dish",
  "ingredients": ["Ingredient 1 with amount", "Ingredient 2 with amount"],
  "instructions": "Step by step cooking instructions",
  "cooking_time": cooking time in minutes (number only),
  "difficulty": "easy", "medium", or "hard" based on complexity,
  "image_prompt": "A detailed description for generating an image of this dish",
  "meal_type": "${mealType}",
  "calories_per_serving": approximate calories per serving (number only)
}`;

      console.log(`Sending request to OpenAI for ${mealType} recipe`);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Create a ${cuisineLevel} ${mealType} recipe ${promptIngredients}${dietaryConstraints}. Be sure to include an accurate calories_per_serving value.` }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`OpenAI API error for ${mealType}:`, errorData);
        throw new Error(`OpenAI API error for ${mealType}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      console.log(`OpenAI response received for ${mealType}:`, content.substring(0, 100) + "...");
      
      // Parse the response to extract recipe
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
          
          // Ensure there's a calories_per_serving field
          if (!recipe.calories_per_serving || isNaN(Number(recipe.calories_per_serving))) {
            // Default fallback based on meal type if missing
            const defaultCalories = {
              breakfast: 400,
              lunch: 600,
              dinner: 800,
              snack: 200
            };
            recipe.calories_per_serving = defaultCalories[mealType] || 500;
          } else {
            // Ensure it's a number
            recipe.calories_per_serving = Number(recipe.calories_per_serving);
          }
          
          allRecipes.push(recipe);
        }
      } catch (parseError) {
        console.error(`Error parsing OpenAI response for ${mealType}:`, parseError);
        throw new Error(`Failed to parse recipe data from OpenAI response for ${mealType}`);
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

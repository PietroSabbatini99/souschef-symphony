
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
      ingredients, 
      mealType = "dinner", 
      count = 1 
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
    
    let promptIngredients = "using common ingredients";
    if (ingredients && ingredients.length > 0) {
      promptIngredients = `using the following ingredients: ${ingredients.join(", ")}`;
    }

    // Construct recipe generation prompt
    const systemPrompt = `You are a professional chef specialized in creating ${styleDescription} recipes. Generate ${count > 1 ? count + ' different' : 'a'} ${mealType} recipe${count > 1 ? 's' : ''} ${promptIngredients}.

For the recipe name:
- If cuisine level is "street": Create a catchy, simple name
- If cuisine level is "home": Create a straightforward, approachable name
- If cuisine level is "gourmet": Create an elegant, sophisticated name

For each recipe, provide the following JSON structure:
{
  "title": "Recipe Title",
  "description": "Brief appetizing description of the dish",
  "ingredients": ["Ingredient 1 with amount", "Ingredient 2 with amount"],
  "instructions": "Step by step cooking instructions",
  "cooking_time": cooking time in minutes (number only),
  "difficulty": "easy", "medium", or "hard" based on complexity,
  "image_prompt": "A detailed description for generating an image of this dish"
}`;

    console.log("Sending request to OpenAI with prompt:", systemPrompt);

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
          { role: 'user', content: `Create ${count > 1 ? count + ' different' : 'a'} ${cuisineLevel} ${mealType} recipe${count > 1 ? 's' : ''} ${promptIngredients}.` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("OpenAI response received:", content.substring(0, 100) + "...");
    
    // Parse the response to extract recipes
    let recipes = [];
    
    try {
      // Handle both array format and single object format
      if (content.trim().startsWith('[')) {
        recipes = JSON.parse(content);
      } else if (content.trim().startsWith('{')) {
        recipes = [JSON.parse(content)];
      } else {
        // Extract JSON objects from text if OpenAI didn't return proper JSON
        const jsonMatches = content.match(/\{[\s\S]*?\}/g);
        if (jsonMatches) {
          recipes = jsonMatches.map(match => JSON.parse(match));
        }
      }
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      throw new Error("Failed to parse recipe data from OpenAI response");
    }

    return new Response(JSON.stringify({ recipes }), {
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

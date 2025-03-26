
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

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
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Create a Supabase client with the authorization header
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://xndorttfogfjwfpfqvfh.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZG9ydHRmb2dmandmcGZxdmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTAzNDYsImV4cCI6MjA1ODU4NjM0Nn0.fXXW5Mp50c4P3Sw5QajLaNuJY1_NbNtcZEgABTEIe5E';
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get the recipe data from the request
    const { 
      recipe,
      imageUrl,
      mealType,
      plannedDate
    } = await req.json();

    if (!recipe) {
      throw new Error('Recipe data is required');
    }

    // Get the user from the authorization header
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("User error:", userError);
      throw new Error('Authentication failed');
    }
    
    if (!user) {
      console.error("No user found");
      throw new Error('Authentication failed - no user found');
    }

    console.log("User authenticated:", user.id);
    
    // Prepare the recipe data for insertion
    const recipeData = {
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cooking_time: recipe.cooking_time,
      difficulty: recipe.difficulty,
      image_url: imageUrl || recipe.image_url,
      user_id: user.id,
    };

    console.log("Saving recipe:", recipeData.title);

    // Insert the recipe into the database
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .insert(recipeData)
      .select()
      .single();

    if (recipeError) {
      console.error("Recipe insert error:", recipeError);
      throw recipeError;
    }

    console.log("Recipe saved successfully with ID:", recipeData.id);
    
    // If meal type and planned date are provided, create a meal plan entry
    if (mealType && plannedDate) {
      const mealPlanData = {
        recipe_id: recipeData.id,
        user_id: user.id,
        meal_type: mealType,
        planned_date: plannedDate
      };

      console.log("Creating meal plan:", mealPlanData);

      const { data: mealPlanResult, error: mealPlanError } = await supabase
        .from('meal_plans')
        .insert(mealPlanData)
        .select()
        .single();

      if (mealPlanError) {
        console.error("Meal plan insert error:", mealPlanError);
        // Don't throw, just log the error since the recipe was saved successfully
      } else {
        console.log("Meal plan created successfully:", mealPlanResult);
      }
    }

    return new Response(JSON.stringify({ success: true, recipe: recipeData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in save-recipe function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

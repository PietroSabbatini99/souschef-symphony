
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
    const recipeInsertData = {
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cooking_time: recipe.cooking_time,
      difficulty: recipe.difficulty,
      image_url: imageUrl || recipe.image_url,
      user_id: user.id,
    };

    console.log("Saving recipe:", recipeInsertData.title);

    // Insert the recipe into the database
    const { data: savedRecipe, error: recipeError } = await supabase
      .from('recipes')
      .insert(recipeInsertData)
      .select()
      .single();

    if (recipeError) {
      console.error("Recipe insert error:", recipeError);
      throw recipeError;
    }

    console.log("Recipe saved successfully with ID:", savedRecipe.id);
    
    // If meal type and planned date are provided, create a meal plan entry
    if (mealType && plannedDate) {
      // If the meal type is an array, create a meal plan entry for each type
      const mealTypes = Array.isArray(mealType) ? mealType : [mealType];
      
      console.log("Creating meal plans for types:", mealTypes);
      
      const mealPlanPromises = mealTypes.map(async (type) => {
        const mealPlanData = {
          recipe_id: savedRecipe.id,
          user_id: user.id,
          meal_type: type,
          planned_date: plannedDate
        };
        
        console.log("Creating meal plan for type:", type);
        
        return supabase
          .from('meal_plans')
          .insert(mealPlanData)
          .select()
          .single();
      });
      
      // Wait for all meal plan entries to be created
      const mealPlanResults = await Promise.all(mealPlanPromises);
      
      // Check for errors in creating meal plans
      const mealPlanErrors = mealPlanResults
        .filter(result => result.error)
        .map(result => result.error);
        
      if (mealPlanErrors.length > 0) {
        console.error("Meal plan insert errors:", mealPlanErrors);
        // Log errors but don't throw since the recipe was saved successfully
      } else {
        console.log("All meal plans created successfully");
      }
    }

    return new Response(JSON.stringify({ success: true, recipe: savedRecipe }), {
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

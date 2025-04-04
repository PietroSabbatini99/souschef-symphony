
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { CuisineLevel } from '@/components/dashboard/CuisineSelector';
import { GeneratedRecipe, MealType } from '@/components/dashboard/RecipeDialog';
import { useMealTypeIngredients } from './useMealTypeIngredients';
import { useUserPreferences } from './useUserPreferences';
import { RecipeGenerationHook } from './types';

export function useRecipeGeneration(): RecipeGenerationHook {
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineLevel | null>(null);
  const [recipeCount, setRecipeCount] = useState<number>(1);
  const [servingsCount, setServingsCount] = useState<number>(2); // Default to 2 persons
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[]>([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);
  const [showRecipeDialog, setShowRecipeDialog] = useState<boolean>(false);
  
  const { user } = useAuth();
  const { userPreferences } = useUserPreferences();
  const { 
    mealTypeIngredients, 
    selectedMealTypes, 
    handleToggleMealType, 
    handleAddMealTypeIngredient, 
    handleRemoveMealTypeIngredient 
  } = useMealTypeIngredients();

  const handleGenerateRecipes = async () => {
    if (!selectedCuisine) {
      toast.error("Please select a cuisine style first");
      return;
    }

    if (selectedMealTypes.length === 0) {
      toast.error("Please select at least one meal type");
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedRecipes([]);
      
      const mealTypeIngredientsToSend = {};
      selectedMealTypes.forEach(mealType => {
        mealTypeIngredientsToSend[mealType] = mealTypeIngredients[mealType];
      });
      
      const response = await supabase.functions.invoke('generate-recipe', {
        body: {
          cuisineLevel: selectedCuisine,
          ingredients: mealTypeIngredientsToSend,
          mealTypes: selectedMealTypes,
          count: recipeCount,
          servings: servingsCount, // Include the servings count in the request
          dietaryPreferences: userPreferences
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data || !response.data.recipes) {
        throw new Error("No recipes were returned from the server");
      }

      if (response.data.recipes.length === 0) {
        throw new Error("No recipes were generated");
      }

      setGeneratedRecipes(response.data.recipes);
      setSelectedRecipeIndex(0);
      setShowRecipeDialog(true);
      
      toast.success(`Generated ${response.data.recipes.length} recipe${response.data.recipes.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error("Error generating recipes:", error);
      toast.error(`Failed to generate recipes: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!user) {
      toast.error("You must be logged in to save recipes");
      return;
    }

    try {
      setIsSaving(true);
      
      const recipe = generatedRecipes[selectedRecipeIndex];
      const today = new Date();
      
      // Map difficulty based on selected cuisine level
      const difficultyMapping = {
        street: "easy",
        home: "medium",
        gourmet: "hard"
      };
      
      // For cuisine, directly use the selectedCuisine
      // For difficulty, use recipe difficulty if available, otherwise derive from cuisine level
      const recipeDifficulty = recipe.difficulty || difficultyMapping[selectedCuisine || 'home'];
      
      // Extract calories_per_serving from the recipe if available
      const caloriesPerServing = recipe.calories_per_serving || 0;
      
      const { data: savedRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cooking_time: recipe.cooking_time,
          difficulty: recipeDifficulty,
          cuisine: selectedCuisine, // Always save the explicitly selected cuisine level
          image_url: recipe.image_url || null,
          user_id: user.id,
          calories_per_serving: caloriesPerServing,  // Save calories per serving
          servings: servingsCount  // Save the number of servings
        })
        .select()
        .single();

      if (recipeError) {
        throw new Error(`Failed to save recipe: ${recipeError.message}`);
      }

      const mealType = recipe.meal_type || selectedMealTypes[0];
      
      const { error: mealPlanError } = await supabase
        .from('meal_plans')
        .insert({
          recipe_id: savedRecipe.id,
          user_id: user.id,
          meal_type: mealType,
          planned_date: format(today, 'yyyy-MM-dd')
        });

      if (mealPlanError) {
        console.error("Error creating meal plan:", mealPlanError);
        toast.error(`Recipe saved but couldn't add to meal plan: ${mealPlanError.message}`);
      } else {
        toast.success("Recipe saved and added to meal plan!");
      }
      
      setShowRecipeDialog(false);
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error(`Failed to save recipe: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedCuisine,
    setSelectedCuisine,
    mealTypeIngredients,
    selectedMealTypes,
    recipeCount,
    setRecipeCount,
    servingsCount,
    setServingsCount,
    isGenerating,
    isSaving,
    generatedRecipes,
    selectedRecipeIndex,
    setSelectedRecipeIndex,
    showRecipeDialog,
    setShowRecipeDialog,
    userPreferences,
    handleToggleMealType,
    handleAddMealTypeIngredient,
    handleRemoveMealTypeIngredient,
    handleGenerateRecipes,
    handleSaveRecipe
  };
}

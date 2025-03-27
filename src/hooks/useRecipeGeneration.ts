
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { CuisineLevel } from '@/components/dashboard/CuisineSelector';
import { GeneratedRecipe, MealType } from '@/components/dashboard/RecipeDialog';
import { DietaryPreferences } from '@/components/dashboard/analytics/types';

export function useRecipeGeneration() {
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineLevel | null>(null);
  const [mealTypeIngredients, setMealTypeIngredients] = useState<Record<MealType, string[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>(['dinner']);
  const [recipeCount, setRecipeCount] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[]>([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);
  const [showRecipeDialog, setShowRecipeDialog] = useState<boolean>(false);
  const [userPreferences, setUserPreferences] = useState<DietaryPreferences>({});
  
  const { user } = useAuth();

  const handleToggleMealType = (mealType: MealType) => {
    setSelectedMealTypes(prev => {
      if (prev.includes(mealType)) {
        return prev.filter(type => type !== mealType);
      } else {
        return [...prev, mealType];
      }
    });
  };

  const handleAddMealTypeIngredient = (mealType: MealType, ingredient: string) => {
    if (!ingredient.trim()) return;
    
    setMealTypeIngredients(prev => {
      if (!prev[mealType].includes(ingredient)) {
        return {
          ...prev,
          [mealType]: [...prev[mealType], ingredient]
        };
      }
      return prev;
    });
  };

  const handleRemoveMealTypeIngredient = (mealType: MealType, ingredient: string) => {
    setMealTypeIngredients(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(item => item !== ingredient)
    }));
  };

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('dietary_preferences')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data && data.dietary_preferences) {
          setUserPreferences(data.dietary_preferences as DietaryPreferences);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };
    
    fetchUserPreferences();
  }, [user]);

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
      
      const difficultyMapping = {
        street: "easy",
        home: "medium",
        gourmet: "hard"
      };
      
      const recipeDifficulty = recipe.difficulty || 
        difficultyMapping[selectedCuisine || 'home'];
      
      const { data: savedRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cooking_time: recipe.cooking_time,
          difficulty: recipeDifficulty,
          cuisine: selectedCuisine || 'home',
          image_url: recipe.image_url || null,
          user_id: user.id
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
    isGenerating,
    isSaving,
    generatedRecipes,
    selectedRecipeIndex,
    setSelectedRecipeIndex,
    showRecipeDialog,
    setShowRecipeDialog,
    handleToggleMealType,
    handleAddMealTypeIngredient,
    handleRemoveMealTypeIngredient,
    handleGenerateRecipes,
    handleSaveRecipe
  };
}

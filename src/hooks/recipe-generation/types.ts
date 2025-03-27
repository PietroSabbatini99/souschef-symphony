
import { CuisineLevel } from '@/components/dashboard/CuisineSelector';
import { GeneratedRecipe, MealType } from '@/components/dashboard/RecipeDialog';
import { DietaryPreferences } from '@/components/dashboard/analytics/types';

export interface RecipeGenerationState {
  selectedCuisine: CuisineLevel | null;
  mealTypeIngredients: Record<MealType, string[]>;
  selectedMealTypes: MealType[];
  recipeCount: number;
  isGenerating: boolean;
  isSaving: boolean;
  generatedRecipes: GeneratedRecipe[];
  selectedRecipeIndex: number;
  showRecipeDialog: boolean;
  userPreferences: DietaryPreferences;
}

export interface RecipeGenerationActions {
  setSelectedCuisine: (cuisine: CuisineLevel | null) => void;
  setRecipeCount: (count: number) => void;
  setSelectedRecipeIndex: (index: number) => void;
  setShowRecipeDialog: (show: boolean) => void;
  handleToggleMealType: (mealType: MealType) => void;
  handleAddMealTypeIngredient: (mealType: MealType, ingredient: string) => void;
  handleRemoveMealTypeIngredient: (mealType: MealType, ingredient: string) => void;
  handleGenerateRecipes: () => Promise<void>;
  handleSaveRecipe: () => Promise<void>;
}

export type RecipeGenerationHook = RecipeGenerationState & RecipeGenerationActions;

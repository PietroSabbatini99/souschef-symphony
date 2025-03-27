
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { RecipeGenerator } from '@/components/dashboard/RecipeGenerator';
import { RecipeDialog } from '@/components/dashboard/RecipeDialog';
import { useRecipeGeneration } from '@/hooks/useRecipeGeneration';

export function RecipeCreator() {
  const {
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
  } = useRecipeGeneration();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Recipe</h1>
          <p className="text-gray-600">Customize your preferences or let AI surprise you</p>
        </div>
        <Badge className="bg-souschef-red/10 text-souschef-red border-souschef-red/20 px-3 py-1.5 flex items-center gap-1.5">
          <Sparkles size={14} />
          AI-Powered
        </Badge>
      </div>
      
      <RecipeGenerator
        selectedCuisine={selectedCuisine}
        setSelectedCuisine={setSelectedCuisine}
        selectedMealTypes={selectedMealTypes}
        handleToggleMealType={handleToggleMealType}
        mealTypeIngredients={mealTypeIngredients}
        handleAddMealTypeIngredient={handleAddMealTypeIngredient}
        handleRemoveMealTypeIngredient={handleRemoveMealTypeIngredient}
        recipeCount={recipeCount}
        setRecipeCount={setRecipeCount}
        isGenerating={isGenerating}
        onGenerateRecipes={handleGenerateRecipes}
      />

      <RecipeDialog
        open={showRecipeDialog}
        onOpenChange={setShowRecipeDialog}
        recipes={generatedRecipes}
        selectedRecipeIndex={selectedRecipeIndex}
        setSelectedRecipeIndex={setSelectedRecipeIndex}
        onSaveRecipe={handleSaveRecipe}
        isSaving={isSaving}
      />
    </div>
  );
}

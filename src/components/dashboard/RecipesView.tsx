
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { SearchBar } from './recipes/SearchBar';
import { RecipeList } from './recipes/RecipeList';
import { RecipeDetailView } from './recipes/RecipeDetailView';
import { RecipeListSkeleton } from './recipes/RecipeListSkeleton';
import { EmptyRecipeState } from './recipes/EmptyRecipeState';
import { Recipe } from './recipes/types';
import { getCuisineLevel, getIngredientsList } from './recipes/recipeUtils';

export function RecipesView() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const { user } = useAuth();

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = data as Recipe[];
      setRecipes(typedData || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  const filteredRecipes = searchQuery 
    ? recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : recipes;

  const handleCreateRecipe = () => {
    toast.info('Recipe creation form will be added in the next phase!');
  };

  const handleRecipeDeleted = () => {
    fetchRecipes();
  };

  const handleViewRecipe = async (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      setViewingRecipe(recipe);
    } else {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setViewingRecipe(data as Recipe);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast.error('Failed to load recipe details');
      }
    }
  };

  if (viewingRecipe) {
    return (
      <RecipeDetailView 
        recipe={viewingRecipe} 
        onBack={() => setViewingRecipe(null)}
        getCuisineLevel={getCuisineLevel}
        getIngredientsList={getIngredientsList}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <p className="text-gray-600"></p>
        </div>
        
        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          onCreateRecipe={handleCreateRecipe}
        />
      </div>
      
      {loading ? (
        <RecipeListSkeleton />
      ) : filteredRecipes.length > 0 ? (
        <RecipeList 
          recipes={filteredRecipes}
          onRecipeDeleted={handleRecipeDeleted}
          onViewRecipe={handleViewRecipe}
          getCuisineLevel={getCuisineLevel}
          getIngredientsList={getIngredientsList}
        />
      ) : (
        <EmptyRecipeState onCreateRecipe={handleCreateRecipe} />
      )}
    </div>
  );
}

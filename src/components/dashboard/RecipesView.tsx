
import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, ChefHat, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecipeCard } from './RecipeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cooking_time: number;
  difficulty: string;
  ingredients: Record<string, any> | string | any[];
  instructions: string;
  created_at: string;
}

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

      // Handle data with proper typing
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
    // Will be implemented in future
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

  const getDifficultyLevel = (difficulty: string): 'street' | 'home' | 'gourmet' => {
    switch (difficulty) {
      case 'easy':
        return 'street';
      case 'medium':
        return 'home';
      case 'hard':
        return 'gourmet';
      default:
        return 'home';
    }
  };

  const getIngredientsList = (ingredients: Record<string, any> | string | any[]): string[] => {
    if (!ingredients) return [];
    try {
      if (typeof ingredients === 'string') {
        const parsed = JSON.parse(ingredients);
        return Array.isArray(parsed) ? parsed : Object.keys(parsed);
      }
      return Array.isArray(ingredients) ? ingredients : Object.keys(ingredients);
    } catch (e) {
      console.error('Error parsing ingredients:', e);
      return [];
    }
  };

  // Render detailed recipe view
  if (viewingRecipe) {
    return (
      <div className="w-full">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => setViewingRecipe(null)}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to recipes
          </Button>
          <h2 className="text-2xl font-bold">{viewingRecipe.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-5">
              <img 
                src={viewingRecipe.image_url || 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1080&auto=format&fit=crop'} 
                alt={viewingRecipe.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{viewingRecipe.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  {getIngredientsList(viewingRecipe.ingredients).map((ingredient, index) => (
                    <li key={index} className="text-gray-600">{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Instructions</h3>
                <div className="space-y-3 text-gray-600">
                  {viewingRecipe.instructions.split('\n').map((instruction, index) => (
                    <p key={index}>{instruction}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Recipe Details</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Difficulty</div>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${getDifficultyLevel(viewingRecipe.difficulty) === 'street' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                      ${getDifficultyLevel(viewingRecipe.difficulty) === 'home' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                      ${getDifficultyLevel(viewingRecipe.difficulty) === 'gourmet' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                    `}
                  >
                    {viewingRecipe.difficulty === 'easy' ? 'Easy' : 
                     viewingRecipe.difficulty === 'medium' ? 'Medium' : 'Hard'}
                  </Badge>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Cooking Time</div>
                  <div className="font-medium flex items-center">
                    <Clock size={16} className="mr-2 text-gray-500" />
                    {viewingRecipe.cooking_time} minutes
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Created</div>
                  <div className="text-gray-600">
                    {new Date(viewingRecipe.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render recipes list
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">My Recipes</h2>
          <p className="text-gray-600"></p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input placeholder="Search recipes..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <Button onClick={handleCreateRecipe} className="bg-souschef-red hover:bg-souschef-red-light text-white">
            <PlusCircle size={18} className="mr-2" />
            New Recipe
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="w-2/3 h-6 mb-2" />
                <Skeleton className="w-full h-4 mb-1" />
                <Skeleton className="w-full h-4 mb-4" />
                <Skeleton className="w-1/3 h-4 mb-2" />
                <Skeleton className="w-full h-8 mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard 
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description || ''}
              imageUrl={recipe.image_url || 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1080&auto=format&fit=crop'}
              cookingTime={recipe.cooking_time ? `${recipe.cooking_time} mins` : '30 mins'}
              level={getDifficultyLevel(recipe.difficulty)}
              ingredients={getIngredientsList(recipe.ingredients)}
              onDeleted={handleRecipeDeleted}
              onView={handleViewRecipe}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <ChefHat size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes yet</h3>
          <p className="text-gray-500 mb-6">Create your first recipe or generate one with AI</p>
          <Button onClick={handleCreateRecipe} className="bg-souschef-red hover:bg-souschef-red-light text-white">
            <PlusCircle size={18} className="mr-2" />
            Create Recipe
          </Button>
        </div>
      )}
    </div>
  );
}

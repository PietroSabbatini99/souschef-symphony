import React from 'react';
import { ChefHat, Clock, Bookmark, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: string;
  level: 'street' | 'home' | 'gourmet';
  ingredients: string[];
  onDeleted?: () => void;
  onView?: (id: string) => void;
}

export function RecipeCard({
  id,
  title,
  description,
  imageUrl,
  cookingTime,
  level,
  ingredients,
  onDeleted,
  onView
}: RecipeCardProps) {
  const levelLabel = {
    street: 'Street Food',
    home: 'Home Cooking',
    gourmet: 'Gourmet'
  };

  const levelIcon = {
    street: <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Street Food</Badge>,
    home: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Home Cooking</Badge>,
    gourmet: <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Gourmet</Badge>
  };

  const handleDelete = async () => {
    try {
      // First check if recipe is used in meal plans
      const { data: mealPlans, error: mealPlanError } = await supabase
        .from('meal_plans')
        .select('id')
        .eq('recipe_id', id);
      
      if (mealPlanError) throw mealPlanError;
      
      // If recipe is used in meal plans, delete those first
      if (mealPlans && mealPlans.length > 0) {
        const { error: deleteMealPlanError } = await supabase
          .from('meal_plans')
          .delete()
          .eq('recipe_id', id);
        
        if (deleteMealPlanError) throw deleteMealPlanError;
      }
      
      // Now delete the recipe
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Recipe deleted successfully');
      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const handleView = () => {
    if (onView) {
      onView(id);
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-all duration-300 hover:opacity-90"
        />
        <div className="absolute top-3 left-3">
          {levelIcon[level]}
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock size={14} className="mr-1" />
              <span>{cookingTime}</span>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
              <Bookmark size={18} />
            </Button>
            {onDeleted && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                    <Trash2 size={18} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this recipe? This action cannot be undone.
                      {/* Add warning about meal plans if you want */}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-gray-600 line-clamp-2 text-sm">{description}</p>
        
        <div className="mt-3">
          <div className="text-xs font-medium text-gray-500 mb-1.5">Main Ingredients:</div>
          <div className="flex flex-wrap gap-1.5">
            {ingredients.slice(0, 4).map((ingredient, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800">
                {ingredient}
              </Badge>
            ))}
            {ingredients.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800">
                +{ingredients.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between">
        <Button 
          size="sm" 
          className="bg-souschef-red hover:bg-souschef-red-light text-white w-full"
          onClick={handleView}
        >
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}

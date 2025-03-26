
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  CuisineSelector, 
  type CuisineLevel 
} from '@/components/dashboard/CuisineSelector';
import { IngredientSelector } from '@/components/dashboard/IngredientSelector';
import { 
  Sparkles, 
  Check, 
  Clock, 
  ChefHat, 
  Save, 
  Image as ImageIcon, 
  Calendar,
  Coffee,
  Utensils,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { format } from 'date-fns';

interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  cooking_time: number;
  difficulty: string;
  image_prompt: string;
  image_url?: string;
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export function RecipeCreator() {
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineLevel | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>(['dinner']);
  const [recipeCount, setRecipeCount] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[]>([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);
  const [showRecipeDialog, setShowRecipeDialog] = useState<boolean>(false);
  
  const { user } = useAuth();

  const handleAddIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
  };

  const handleMealTypeChange = (value: string[]) => {
    setSelectedMealTypes(value as MealType[]);
  };

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
      
      const response = await supabase.functions.invoke('generate-recipe', {
        body: {
          cuisineLevel: selectedCuisine,
          ingredients: selectedIngredients,
          mealType: selectedMealTypes.join(','),
          count: recipeCount
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data.recipes || response.data.recipes.length === 0) {
        throw new Error("No recipes were generated");
      }

      setGeneratedRecipes(response.data.recipes);
      setSelectedRecipeIndex(0);
      setShowRecipeDialog(true);

      // Generate image for the first recipe
      generateImageForRecipe(0, response.data.recipes);
      
      toast.success(`Generated ${response.data.recipes.length} recipe${response.data.recipes.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error("Error generating recipes:", error);
      toast.error(`Failed to generate recipes: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImageForRecipe = async (index: number, recipes = generatedRecipes) => {
    if (!recipes[index]) return;

    try {
      setIsGeneratingImage(true);
      
      const response = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: recipes[index].image_prompt || recipes[index].title
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data.imageUrl) {
        throw new Error("No image was generated");
      }

      const updatedRecipes = [...recipes];
      updatedRecipes[index] = {
        ...updatedRecipes[index],
        image_url: response.data.imageUrl
      };
      
      setGeneratedRecipes(updatedRecipes);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(`Failed to generate image: ${error.message}`);
    } finally {
      setIsGeneratingImage(false);
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
      
      const response = await supabase.functions.invoke('save-recipe', {
        body: {
          recipe,
          imageUrl: recipe.image_url,
          mealType: selectedMealTypes[0],  // Use the first selected meal type
          plannedDate: format(today, 'yyyy-MM-dd')  // Default to today
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success("Recipe saved successfully!");
      
      // Close the dialog after saving
      setShowRecipeDialog(false);
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error(`Failed to save recipe: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedRecipe = generatedRecipes[selectedRecipeIndex];

  const getMealTypeIcon = (type: MealType) => {
    switch (type) {
      case 'breakfast':
        return <Coffee className="h-4 w-4" />;
      case 'lunch':
        return <Utensils className="h-4 w-4" />;
      case 'dinner':
        return <ChefHat className="h-4 w-4" />;
      case 'snack':
        return <Coffee className="h-4 w-4" />;
      default:
        return <Utensils className="h-4 w-4" />;
    }
  };

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
      
      <div className="space-y-8">
        <CuisineSelector 
          selectedLevel={selectedCuisine}
          onSelect={setSelectedCuisine}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Meal Type</h2>
            <ToggleGroup 
              type="multiple" 
              value={selectedMealTypes}
              onValueChange={handleMealTypeChange}
              className="flex flex-wrap justify-start gap-2"
            >
              <ToggleGroupItem value="breakfast" className="flex items-center gap-1 border border-gray-200">
                <Coffee size={16} />
                <span>Breakfast</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="lunch" className="flex items-center gap-1 border border-gray-200">
                <Utensils size={16} />
                <span>Lunch</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="dinner" className="flex items-center gap-1 border border-gray-200">
                <ChefHat size={16} />
                <span>Dinner</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="snack" className="flex items-center gap-1 border border-gray-200">
                <Coffee size={16} />
                <span>Snack</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Number of Recipes</h2>
            <Select 
              value={recipeCount.toString()} 
              onValueChange={(value) => setRecipeCount(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Number of recipes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Single Recipe
                  </div>
                </SelectItem>
                <SelectItem value="3">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    3-Day Meal Plan
                  </div>
                </SelectItem>
                <SelectItem value="5">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    5-Day Meal Plan
                  </div>
                </SelectItem>
                <SelectItem value="7">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    7-Day Meal Plan
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <IngredientSelector
          selectedIngredients={selectedIngredients}
          onAddIngredient={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
        />
        
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button 
            onClick={handleGenerateRecipes}
            disabled={!selectedCuisine || selectedMealTypes.length === 0 || isGenerating}
            className="px-6 bg-souschef-red hover:bg-souschef-red-light text-white"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} className="mr-2" />
                Generate Recipe
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Recipe Viewer Dialog */}
      <Dialog open={showRecipeDialog} onOpenChange={setShowRecipeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedRecipe.title}</DialogTitle>
                <DialogDescription>
                  {selectedRecipe.description}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="aspect-square rounded-md overflow-hidden bg-gray-100 relative">
                    {selectedRecipe.image_url ? (
                      <img 
                        src={selectedRecipe.image_url} 
                        alt={selectedRecipe.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {isGeneratingImage ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                            <p className="text-sm text-gray-500 mt-3">Generating image...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <ImageIcon className="h-10 w-10 text-gray-400" />
                            <p className="text-sm text-gray-500 mt-3">No image available</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => generateImageForRecipe(selectedRecipeIndex)}
                            >
                              Generate Image
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <Clock size={14} /> {selectedRecipe.cooking_time} mins
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <ChefHat size={14} /> {selectedRecipe.difficulty}
                    </Badge>
                    {selectedMealTypes.map((mealType) => (
                      <Badge key={mealType} variant="outline" className="flex items-center gap-1.5">
                        {getMealTypeIcon(mealType)} {mealType}
                      </Badge>
                    ))}
                  </div>

                  {generatedRecipes.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {generatedRecipes.map((_, index) => (
                        <Button
                          key={index}
                          variant={index === selectedRecipeIndex ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedRecipeIndex(index)}
                          className={index === selectedRecipeIndex ? "bg-souschef-red hover:bg-souschef-red-light" : ""}
                        >
                          Recipe {index + 1}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Instructions</h3>
                    <div className="whitespace-pre-line text-gray-700">
                      {selectedRecipe.instructions}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowRecipeDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveRecipe}
                  disabled={isSaving}
                  className="bg-souschef-red hover:bg-souschef-red-light text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Recipe
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

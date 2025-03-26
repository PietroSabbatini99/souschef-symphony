import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  PlusCircle,
  Calendar as CalendarComponent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecipeCard } from './RecipeCard';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface MealPlanViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

interface MealPlan {
  id: string;
  recipe_id: string;
  planned_date: string;
  meal_type: string;
  recipe: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    cooking_time: number;
    difficulty: string;
    ingredients: Json;
  };
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MealPlanView({ selectedDate, onDateChange }: MealPlanViewProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const getDaysInWeek = () => {
    const day = selectedDate.getDay();
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - day);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };
  
  const weekDays = getDaysInWeek();
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };
  
  const previousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    onDateChange(newDate);
  };
  
  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    onDateChange(newDate);
  };

  useEffect(() => {
    async function fetchMealPlans() {
      try {
        setLoading(true);
        
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        
        const { data, error } = await supabase
          .from('meal_plans')
          .select(`
            id,
            recipe_id,
            planned_date,
            meal_type,
            recipe:recipes(
              id,
              title,
              description,
              image_url,
              cooking_time,
              difficulty,
              ingredients
            )
          `)
          .eq('planned_date', formattedDate);
          
        if (error) throw error;
        
        setMealPlans(data || []);
      } catch (error) {
        console.error('Error fetching meal plans:', error);
        toast.error('Failed to load meal plans');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMealPlans();
  }, [selectedDate]);

  const handleAddMeal = () => {
    toast.info('Meal plan creation will be added in the next phase!');
  };
  
  const getDifficultyLevel = (difficulty: string): 'street' | 'home' | 'gourmet' => {
    switch (difficulty) {
      case 'easy': return 'street';
      case 'medium': return 'home';
      case 'hard': return 'gourmet';
      default: return 'home';
    }
  };

  const getIngredientsList = (ingredients: Json): string[] => {
    if (!ingredients) return [];
    
    try {
      if (typeof ingredients === 'string') {
        const parsed = JSON.parse(ingredients);
        return Array.isArray(parsed) ? parsed : Object.keys(parsed);
      }
      
      if (Array.isArray(ingredients)) {
        return ingredients.map(item => String(item));
      } else if (typeof ingredients === 'object') {
        return Object.keys(ingredients);
      }
      
      return [];
    } catch (e) {
      console.error('Error parsing ingredients:', e);
      return [];
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Meal Plan</h2>
          <p className="text-gray-600">Plan your meals for the week</p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          <Button variant="outline" size="icon" onClick={previousWeek}>
            <ChevronLeft size={18} />
          </Button>
          
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="mx-2 px-3 py-1.5"
              >
                <CalendarIcon size={16} className="mr-2 text-gray-500" />
                <span className="font-medium">
                  {format(selectedDate, 'MMMM yyyy')}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onDateChange(date);
                    setIsCalendarOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-8">
        {weekDays.map((date, index) => (
          <button
            key={index}
            onClick={() => onDateChange(date)}
            className={`
              flex flex-col items-center py-3 rounded-lg transition-colors
              ${isSelected(date) 
                ? 'bg-souschef-red text-white' 
                : isToday(date)
                  ? 'bg-souschef-red/10 text-souschef-red'
                  : 'hover:bg-gray-100'
              }
            `}
          >
            <span className="text-xs font-medium mb-1">
              {DAYS[date.getDay()]}
            </span>
            <span className="text-lg font-semibold">
              {date.getDate()}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {format(selectedDate, 'EEEE, MMMM d')} Meals
        </h3>
        <Button variant="outline" size="sm" className="gap-1" onClick={handleAddMeal}>
          <PlusCircle size={16} />
          Add Meal
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
      ) : mealPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlans.map((mealPlan) => (
            <RecipeCard
              key={mealPlan.id}
              title={`${mealPlan.meal_type.charAt(0).toUpperCase() + mealPlan.meal_type.slice(1)}: ${mealPlan.recipe.title}`}
              description={mealPlan.recipe.description || ''}
              imageUrl={mealPlan.recipe.image_url || 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1080&auto=format&fit=crop'}
              cookingTime={mealPlan.recipe.cooking_time ? `${mealPlan.recipe.cooking_time} mins` : '30 mins'}
              level={getDifficultyLevel(mealPlan.recipe.difficulty)}
              ingredients={getIngredientsList(mealPlan.recipe.ingredients)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <CalendarComponent size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No meals planned</h3>
          <p className="text-gray-500 mb-6">Add meals to your calendar for this day</p>
          <Button onClick={handleAddMeal} className="bg-souschef-red hover:bg-souschef-red-light text-white">
            <PlusCircle size={18} className="mr-2" />
            Add Meal Plan
          </Button>
        </div>
      )}
    </div>
  );
}

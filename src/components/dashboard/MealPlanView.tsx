
import React from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  PlusCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecipeCard } from './RecipeCard';

interface MealPlanViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MealPlanView({ selectedDate, onDateChange }: MealPlanViewProps) {
  // Sample data - this would come from an API in the real app
  const meals = [
    {
      id: 1,
      title: "Spicy Chicken Tacos",
      description: "Street-style tacos with marinated chicken, fresh lime, and homemade salsa.",
      imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1080&auto=format&fit=crop",
      cookingTime: "25 mins",
      level: "street",
      ingredients: ["Chicken", "Tortillas", "Onion", "Cilantro", "Lime"]
    },
    {
      id: 2,
      title: "Creamy Garlic Parmesan Pasta",
      description: "Simple but delicious pasta with a creamy garlic parmesan sauce.",
      imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1080&auto=format&fit=crop",
      cookingTime: "20 mins",
      level: "home",
      ingredients: ["Pasta", "Parmesan", "Garlic", "Cream", "Butter"]
    },
    {
      id: 3,
      title: "Pan-Seared Salmon with Lemon Butter",
      description: "Elegant salmon dish with a delicate lemon butter sauce and fresh herbs.",
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1080&auto=format&fit=crop",
      cookingTime: "30 mins",
      level: "gourmet",
      ingredients: ["Salmon", "Lemon", "Butter", "Herbs", "White Wine"]
    }
  ];

  // For demonstration purposes, we'll show the week around the selected date
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
          
          <div className="flex items-center mx-2 px-3 py-1.5 rounded-lg bg-gray-100">
            <Calendar size={16} className="mr-2 text-gray-500" />
            <span className="font-medium">
              {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </span>
          </div>
          
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      
      {/* Date selector */}
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
          Today's Meals
        </h3>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle size={16} />
          Add Meal
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <RecipeCard
            key={meal.id}
            title={meal.title}
            description={meal.description}
            imageUrl={meal.imageUrl}
            cookingTime={meal.cookingTime}
            level={meal.level as 'street' | 'home' | 'gourmet'}
            ingredients={meal.ingredients}
          />
        ))}
      </div>
    </div>
  );
}

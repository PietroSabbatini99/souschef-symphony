
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { 
  CuisineSelector, 
  type CuisineLevel 
} from '@/components/dashboard/CuisineSelector';
import { IngredientSelector } from '@/components/dashboard/IngredientSelector';
import { MealPlanView } from '@/components/dashboard/MealPlanView';
import { RecipesView } from '@/components/dashboard/RecipesView';
import { AnalyticsView } from '@/components/dashboard/AnalyticsView';
import { 
  Calendar, 
  Settings, 
  LogOut, 
  ChefHat, 
  Home, 
  User,
  MessageSquare,
  Sparkles,
  BarChart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard = () => {
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineLevel | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'calendar' | 'recipes' | 'create' | 'analytics'>('calendar');
  const [isLoading, setIsLoading] = useState(false);
  const { signOut, user } = useAuth();

  const handleAddIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
  };

  const handleGenerateRecipe = async () => {
    if (!selectedCuisine) return;
    
    setIsLoading(true);
    try {
      // This will be implemented when we add AI integration
      toast.success("Recipe generation will be implemented in the next phase!");
      console.log({
        cuisineLevel: selectedCuisine,
        ingredients: selectedIngredients
      });
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast.error('Failed to generate recipe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-5">
        <div className="mb-8">
          <Logo size="md" />
        </div>
        
        <nav className="flex-1">
          <div className="mb-2 text-xs font-medium text-gray-500">MENU</div>
          <div className="space-y-1">
            <NavButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')}>
              <Calendar size={20} />
              <span>Meal Calendar</span>
            </NavButton>
            <NavButton active={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')}>
              <Home size={20} />
              <span>My Recipes</span>
            </NavButton>
            <NavButton active={activeTab === 'create'} onClick={() => setActiveTab('create')}>
              <ChefHat size={20} />
              <span>Create Recipe</span>
            </NavButton>
            <NavButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
              <BarChart size={20} />
              <span>Analytics</span>
            </NavButton>
          </div>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Button variant="outline" className="w-full justify-start mb-2">
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-600"
            onClick={signOut}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          <div className="md:hidden">
            <Logo size="sm" showText={false} />
          </div>
          
          <div className="flex md:hidden gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={activeTab === 'calendar' ? 'bg-gray-100' : ''} 
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar size={18} className="mr-1" />
              Calendar
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={activeTab === 'recipes' ? 'bg-gray-100' : ''} 
              onClick={() => setActiveTab('recipes')}
            >
              <Home size={18} className="mr-1" />
              Recipes
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={activeTab === 'create' ? 'bg-gray-100' : ''} 
              onClick={() => setActiveTab('create')}
            >
              <ChefHat size={18} className="mr-1" />
              Create
            </Button>
          </div>
          
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <MessageSquare size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="ml-1 text-gray-500">
              <User size={20} />
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {activeTab === 'calendar' && (
            <MealPlanView 
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          )}
          
          {activeTab === 'recipes' && (
            <RecipesView />
          )}
          
          {activeTab === 'create' && (
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
                
                <IngredientSelector
                  selectedIngredients={selectedIngredients}
                  onAddIngredient={handleAddIngredient}
                  onRemoveIngredient={handleRemoveIngredient}
                />
                
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button 
                    onClick={handleGenerateRecipe}
                    disabled={!selectedCuisine || isLoading}
                    className="px-6 bg-souschef-red hover:bg-souschef-red-light text-white btn-hover"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}
        </main>
      </div>
    </div>
  );
};

interface NavButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

function NavButton({ children, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-souschef-red text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export default Dashboard;

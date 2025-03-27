
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { MealPlanView } from '@/components/dashboard/MealPlanView';
import { RecipesView } from '@/components/dashboard/RecipesView';
import { AnalyticsView } from '@/components/dashboard/AnalyticsView';
import { RecipeCreator } from '@/components/dashboard/RecipeCreator';
import { 
  Calendar, 
  Settings, 
  LogOut, 
  ChefHat, 
  Home, 
  User,
  MessageSquare,
  BarChart,
  Menu
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from '@/components/ui/sidebar';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'calendar' | 'recipes' | 'create' | 'analytics'>('calendar');
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar variant="floating" collapsible="offcanvas">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo size="md" />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'calendar'} 
                  onClick={() => setActiveTab('calendar')}
                  tooltip="Meal Calendar"
                >
                  <Calendar size={20} />
                  <span>Meal Calendar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'recipes'} 
                  onClick={() => setActiveTab('recipes')}
                  tooltip="My Recipes"
                >
                  <Home size={20} />
                  <span>My Recipes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'create'} 
                  onClick={() => setActiveTab('create')}
                  tooltip="Create Recipe"
                >
                  <ChefHat size={20} />
                  <span>Create Recipe</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'analytics'} 
                  onClick={() => setActiveTab('analytics')}
                  tooltip="Analytics"
                >
                  <BarChart size={20} />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <Button variant="outline" className="w-full justify-start mb-2">
              <Settings size={16} className="mr-2" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-600"
              onClick={handleSignOut}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main Content */}
        <SidebarInset>
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden">
                <Menu size={20} />
              </SidebarTrigger>
              <h1 className="text-xl font-bold hidden md:block">
                {activeTab === 'calendar' && 'Meal Calendar'}
                {activeTab === 'recipes' && 'My Recipes'}
                {activeTab === 'create' && 'Create Recipe'}
                {activeTab === 'analytics' && 'Analytics'}
              </h1>
            </div>
            
            <div className="flex md:hidden gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={activeTab === 'calendar' ? 'bg-gray-100' : ''} 
                onClick={() => setActiveTab('calendar')}
              >
                <Calendar size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={activeTab === 'recipes' ? 'bg-gray-100' : ''} 
                onClick={() => setActiveTab('recipes')}
              >
                <Home size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={activeTab === 'create' ? 'bg-gray-100' : ''} 
                onClick={() => setActiveTab('create')}
              >
                <ChefHat size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={activeTab === 'analytics' ? 'bg-gray-100' : ''} 
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart size={18} />
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
          
          <main className="p-4 md:p-6 overflow-auto">
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
              <RecipeCreator />
            )}
            
            {activeTab === 'analytics' && (
              <AnalyticsView />
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

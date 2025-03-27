
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
  ChefHat, 
  Home, 
  User,
  BarChart
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
  const [activeTab, setActiveTab] = useState<'calendar' | 'recipes' | 'create' | 'analytics' | 'account'>('calendar');
  const { user } = useAuth();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Main Content */}
        <SidebarInset className="flex-grow overflow-hidden flex flex-col">
          {/* Page Title */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">
                {activeTab === 'calendar' && 'Meal Calendar'}
                {activeTab === 'recipes' && 'My Recipes'}
                {activeTab === 'create' && 'Create Recipe'}
                {activeTab === 'analytics' && 'Analytics'}
                {activeTab === 'account' && 'Account'}
              </h1>
            </div>
          </header>
          
          {/* Content Area */}
          <main className="p-4 md:p-6 overflow-auto flex-grow pb-20">
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
            
            {activeTab === 'account' && (
              <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                {user && (
                  <div className="mb-6">
                    <p className="text-gray-600">Email: {user.email}</p>
                  </div>
                )}
                <Button 
                  variant="destructive" 
                  onClick={async () => {
                    try {
                      await useAuth().signOut();
                      toast.success("Logged out successfully!");
                    } catch (error) {
                      console.error("Error signing out:", error);
                      toast.error("Failed to logout");
                    }
                  }}
                  className="mt-4"
                >
                  Log Out
                </Button>
              </div>
            )}
          </main>
        </SidebarInset>
        
        {/* Bottom Navigation Bar */}
        <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-between px-4 fixed bottom-0 left-0 right-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="w-full flex justify-around">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`text-gray-500 ${activeTab === 'calendar' ? 'text-souschef-red' : ''}`} 
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar size={24} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`text-gray-500 ${activeTab === 'recipes' ? 'text-souschef-red' : ''}`} 
              onClick={() => setActiveTab('recipes')}
            >
              <Home size={24} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`text-gray-500 ${activeTab === 'create' ? 'text-souschef-red' : ''}`} 
              onClick={() => setActiveTab('create')}
            >
              <ChefHat size={24} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`text-gray-500 ${activeTab === 'analytics' ? 'text-souschef-red' : ''}`} 
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart size={24} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`text-gray-500 ${activeTab === 'account' ? 'text-souschef-red' : ''}`} 
              onClick={() => setActiveTab('account')}
            >
              <User size={24} />
            </Button>
          </div>
        </div>
        
        {/* Sidebar - kept for reference but not visible on mobile */}
        <Sidebar variant="floating" collapsible="offcanvas" className="hidden">
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
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

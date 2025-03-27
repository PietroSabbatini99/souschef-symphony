
import React, { useState } from 'react';
import { MealPlanView } from '@/components/dashboard/MealPlanView';
import { RecipesView } from '@/components/dashboard/RecipesView';
import { AnalyticsView } from '@/components/dashboard/AnalyticsView';
import { RecipeCreator } from '@/components/dashboard/RecipeCreator';
import { AccountView } from '@/components/dashboard/AccountView';
import { BottomNavigation } from '@/components/dashboard/BottomNavigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset
} from '@/components/ui/sidebar';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'calendar' | 'recipes' | 'create' | 'analytics' | 'account'>('calendar');

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Main Content */}
        <SidebarInset className="flex-grow overflow-hidden flex flex-col">
          {/* Page Title */}
          <DashboardHeader activeTab={activeTab} />
          
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
              <AccountView />
            )}
          </main>
        </SidebarInset>
        
        {/* Bottom Navigation Bar */}
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Sidebar - kept for reference but not visible on mobile */}
        <Sidebar variant="floating" collapsible="offcanvas" className="hidden">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </Sidebar>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

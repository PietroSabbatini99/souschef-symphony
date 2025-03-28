
import React, { useState } from 'react';
import { MealPlanView } from '@/components/dashboard/MealPlanView';
import { RecipesView } from '@/components/dashboard/RecipesView';
import { AnalyticsView } from '@/components/dashboard/AnalyticsView';
import { RecipeCreator } from '@/components/dashboard/RecipeCreator';
import { AccountView } from '@/components/dashboard/AccountView';
import { BottomNavigation } from '@/components/dashboard/BottomNavigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset
} from '@/components/ui/sidebar';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'calendar' | 'recipes' | 'create' | 'analytics' | 'account'>('calendar');
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <Sidebar variant="floating" collapsible={isMobile ? "offcanvas" : "icon"} className="hidden md:block">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </Sidebar>
        
        {/* Main Content */}
        <SidebarInset className="flex-grow overflow-hidden flex flex-col">
          {/* Page Title */}
          <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Content Area */}
          <main className="p-4 md:p-6 overflow-auto flex-grow pb-24 md:pb-6">
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
        
        {/* Bottom Navigation Bar - only visible on mobile */}
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

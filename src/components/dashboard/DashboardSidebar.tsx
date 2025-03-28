
import React from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { 
  Calendar, 
  Settings, 
  ChefHat, 
  Home, 
  BarChart,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

interface DashboardSidebarProps {
  activeTab: 'calendar' | 'recipes' | 'create' | 'analytics' | 'account';
  setActiveTab: (tab: 'calendar' | 'recipes' | 'create' | 'analytics' | 'account') => void;
}

export function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <>
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
    </>
  );
}

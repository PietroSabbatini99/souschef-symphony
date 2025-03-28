
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface DashboardHeaderProps {
  activeTab: 'calendar' | 'recipes' | 'create' | 'analytics' | 'account';
  setActiveTab: (tab: 'calendar' | 'recipes' | 'create' | 'analytics' | 'account') => void;
}

export function DashboardHeader({ activeTab, setActiveTab }: DashboardHeaderProps) {
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-2 max-w-[1200px] w-full mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">
          {activeTab === 'calendar' && 'Meal Calendar'}
          {activeTab === 'recipes' && 'My Recipes'}
          {activeTab === 'create' && 'Create Recipe'}
          {activeTab === 'analytics' && 'Analytics'}
          {activeTab === 'account' && 'Account'}
        </h1>
        
        <div className="ml-auto">
          <Avatar 
            className="h-10 w-10 cursor-pointer" 
            onClick={() => setActiveTab('account')}
          >
            <AvatarImage src="" />
            <AvatarFallback className="bg-gray-200">
              <User className="h-6 w-6 text-gray-500" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

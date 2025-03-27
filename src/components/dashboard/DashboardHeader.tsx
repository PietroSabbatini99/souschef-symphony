
import React from 'react';

interface DashboardHeaderProps {
  activeTab: 'calendar' | 'recipes' | 'create' | 'analytics' | 'account';
}

export function DashboardHeader({ activeTab }: DashboardHeaderProps) {
  return (
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
  );
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ChefHat, 
  Home,
  BarChart
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BottomNavigationProps {
  activeTab: 'calendar' | 'recipes' | 'create' | 'analytics' | 'account';
  setActiveTab: (tab: 'calendar' | 'recipes' | 'create' | 'analytics' | 'account') => void;
}

export function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-between fixed bottom-0 left-0 right-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
      <div className="w-full max-w-md mx-auto flex justify-around">
        <Button 
          variant="ghost" 
          className={`text-gray-500 flex flex-col gap-1 h-auto py-2 ${activeTab === 'calendar' ? 'text-souschef-red' : ''}`} 
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={24} />
          <span className="text-[10px] font-medium">Calendar</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`text-gray-500 flex flex-col gap-1 h-auto py-2 ${activeTab === 'recipes' ? 'text-souschef-red' : ''}`} 
          onClick={() => setActiveTab('recipes')}
        >
          <Home size={24} />
          <span className="text-[10px] font-medium">Recipes</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`text-gray-500 flex flex-col gap-1 h-auto py-2 ${activeTab === 'create' ? 'text-souschef-red' : ''}`} 
          onClick={() => setActiveTab('create')}
        >
          <ChefHat size={24} />
          <span className="text-[10px] font-medium">Generate</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`text-gray-500 flex flex-col gap-1 h-auto py-2 ${activeTab === 'analytics' ? 'text-souschef-red' : ''}`} 
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart size={24} />
          <span className="text-[10px] font-medium">Analytics</span>
        </Button>
      </div>
    </div>
  );
}


import React from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateRecipe: () => void;
}

export function SearchBar({ searchQuery, onSearchChange, onCreateRecipe }: SearchBarProps) {
  return (
    <div className="mt-4 md:mt-0 flex gap-2 w-full md:w-auto">
      <div className="relative flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search recipes..." 
          className="pl-10" 
          value={searchQuery} 
          onChange={e => onSearchChange(e.target.value)} 
        />
      </div>
      <Button onClick={onCreateRecipe} className="bg-souschef-red hover:bg-souschef-red-light text-white">
        <PlusCircle size={18} className="mr-2" />
        New Recipe
      </Button>
    </div>
  );
}

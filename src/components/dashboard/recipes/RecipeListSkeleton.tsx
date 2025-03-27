
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function RecipeListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
          <Skeleton className="w-full h-48" />
          <div className="p-4">
            <Skeleton className="w-2/3 h-6 mb-2" />
            <Skeleton className="w-full h-4 mb-1" />
            <Skeleton className="w-full h-4 mb-4" />
            <Skeleton className="w-1/3 h-4 mb-2" />
            <Skeleton className="w-full h-8 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

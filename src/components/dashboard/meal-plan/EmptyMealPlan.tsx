
import React from 'react';
import { Calendar as CalendarComponent } from 'lucide-react';

export function EmptyMealPlan() {
  return (
    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
      <CalendarComponent size={48} className="mx-auto text-gray-300 mb-3" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No meals planned</h3>
      <p className="text-gray-500 mb-6">Add meals to your calendar for this day</p>
    </div>
  );
}

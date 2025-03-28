
import React from 'react';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DAYS } from './types';

interface WeekCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function WeekCalendar({ selectedDate, onDateChange }: WeekCalendarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const getDaysInWeek = () => {
    const day = selectedDate.getDay();
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - day);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };
  
  const weekDays = getDaysInWeek();
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };
  
  const previousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    onDateChange(newDate);
  };
  
  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    onDateChange(newDate);
  };

  return (
    <div className="w-full mb-8">
      <div className="flex justify-center items-center mb-6 w-full">
        <div className="flex items-center justify-center mt-4 md:mt-0">
          <Button variant="outline" size="icon" onClick={previousWeek}>
            <ChevronLeft size={18} />
          </Button>
          
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="mx-2 px-3 py-1.5"
              >
                <CalendarIcon size={16} className="mr-2 text-gray-500" />
                <span className="font-medium">
                  {format(selectedDate, 'MMMM yyyy')}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onDateChange(date);
                    setIsCalendarOpen(false);
                  }
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 w-full">
        {weekDays.map((date, index) => (
          <button
            key={index}
            onClick={() => onDateChange(date)}
            className={`
              flex flex-col items-center py-3 rounded-lg transition-colors
              ${isSelected(date) 
                ? 'bg-souschef-red text-white' 
                : isToday(date)
                  ? 'bg-souschef-red/10 text-souschef-red'
                  : 'hover:bg-gray-100'
              }
            `}
          >
            <span className="text-xs font-medium mb-1">
              {DAYS[date.getDay()]}
            </span>
            <span className="text-lg font-semibold">
              {date.getDate()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

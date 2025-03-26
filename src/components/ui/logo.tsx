
import React from 'react';
import { ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  linkClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ 
  className, 
  linkClassName,
  size = 'md', 
  showText = true 
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  };

  const iconSize = {
    sm: 18,
    md: 24,
    lg: 32
  };

  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center gap-2 font-medium transition-opacity hover:opacity-90",
        linkClassName
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-xl bg-souschef-red text-white p-1.5",
        sizeClasses[size],
        className
      )}>
        <ChefHat size={iconSize[size]} strokeWidth={2} className="text-white" />
      </div>
      {showText && (
        <span className={cn(
          "font-semibold tracking-tight",
          {
            'text-lg': size === 'sm',
            'text-xl': size === 'md',
            'text-3xl': size === 'lg'
          }
        )}>
          SousChef
        </span>
      )}
    </Link>
  );
}

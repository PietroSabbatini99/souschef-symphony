
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-souschef-red/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-20 right-0 w-72 h-72 bg-souschef-red/10 rounded-full blur-xl -z-10" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-souschef-red/10 rounded-full blur-xl -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-souschef-red/10 text-souschef-red text-sm font-medium mb-6 animate-fade-down">
            <ChefHat size={16} />
            <span>Your AI-Powered Kitchen Assistant</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-tight mb-6 animate-fade-down" style={{ animationDelay: '100ms' }}>
            Let AI Plan Your Meals with <span className="text-souschef-red">SousChef</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-8 animate-fade-down" style={{ animationDelay: '200ms' }}>
            Discover personalized meal plans and AI-crafted recipes based on your preferences. 
            From street food to gourmet cuisine, SousChef helps you eat well without the hassle of planning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Button asChild size="lg" className="bg-souschef-red hover:bg-souschef-red-light text-white">
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="group">
              <Link to="/features" className="flex items-center">
                View Features
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          {/* App Preview */}
          <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl animate-fade-up glass-card" style={{ animationDelay: '400ms' }}>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1597226051223-a3bdb3bf6b7a?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="SousChef App Interface" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-gray-800 font-medium text-sm">
                  Experience SousChef on any device
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

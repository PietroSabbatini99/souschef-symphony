
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { ChefHat, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-6">
          <Logo size="lg" />
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 animate-fade-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-souschef-red/10 flex items-center justify-center mb-6">
            <ChefHat size={36} className="text-souschef-red" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            Oops! This recipe couldn't be found.
          </p>
          
          <Button asChild size="lg" className="bg-souschef-red hover:bg-souschef-red-light text-white btn-hover">
            <Link to="/" className="flex items-center gap-2">
              <Home size={18} />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

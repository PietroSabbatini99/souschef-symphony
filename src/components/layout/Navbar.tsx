
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "py-3 bg-white/80 backdrop-blur-lg shadow-sm" : "py-5 bg-transparent"
    )}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Logo size="md" />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink href="/" active={isActive('/')}>Home</NavLink>
          <NavLink href="/features" active={isActive('/features')}>Features</NavLink>
          <NavLink href="/pricing" active={isActive('/pricing')}>Pricing</NavLink>
          
          <div className="ml-4 flex items-center space-x-3">
            <Button asChild variant="ghost" className="text-gray-800 font-medium">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-souschef-red hover:bg-souschef-red-light text-white">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-gray-800" />
          ) : (
            <Menu size={24} className="text-gray-800" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-fade-down">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <MobileNavLink href="/" active={isActive('/')}>Home</MobileNavLink>
            <MobileNavLink href="/features" active={isActive('/features')}>Features</MobileNavLink>
            <MobileNavLink href="/pricing" active={isActive('/pricing')}>Pricing</MobileNavLink>
            
            <div className="pt-3 grid grid-cols-2 gap-3 border-t border-gray-100 mt-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="w-full bg-souschef-red hover:bg-souschef-red-light text-white">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      to={href}
      className={cn(
        "px-3 py-2 rounded-md font-medium text-sm transition-colors",
        active 
          ? "text-souschef-red" 
          : "text-gray-700 hover:text-souschef-red hover:bg-gray-50"
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      to={href}
      className={cn(
        "px-3 py-2.5 rounded-md font-medium text-base transition-colors",
        active 
          ? "bg-gray-50 text-souschef-red" 
          : "text-gray-700 hover:bg-gray-50 hover:text-souschef-red"
      )}
    >
      {children}
    </Link>
  );
}

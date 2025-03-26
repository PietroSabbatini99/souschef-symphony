import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Button } from '@/components/ui/button';
import { ChefHat, Calendar, Utensils, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/logo';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        <Features />
        
        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How SousChef Works</h2>
              <p className="text-lg text-gray-600">
                Creating the perfect meal plan has never been this simple.
                Let our AI handle the heavy lifting.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-souschef-red/10 flex items-center justify-center mb-4">
                    <ChefHat className="w-8 h-8 text-souschef-red" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Select Your Preferences</h3>
                  <p className="text-gray-600">
                    Choose your cuisine style and specify any ingredients you'd like to include or avoid.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-souschef-red/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-souschef-red" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Creates Recipes</h3>
                  <p className="text-gray-600">
                    Our advanced AI generates personalized recipes tailored to your tastes and requirements.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-souschef-red/10 flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-souschef-red" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Plan Your Week</h3>
                  <p className="text-gray-600">
                    Organize your meals into a weekly schedule that's balanced and varied.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <Button asChild size="lg" className="bg-souschef-red hover:bg-souschef-red-light text-white btn-hover">
                  <Link to="/signup" className="gap-2">
                    Get Started Free
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonial */}
        <section className="py-20 bg-souschef-red/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src={`https://i.pravatar.cc/100?img=${40 + i}`} 
                        alt={`User ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <blockquote className="text-xl md:text-2xl font-medium mb-6">
                "SousChef has completely transformed how I cook. The AI-powered recipes are delicious and I've discovered so many new favorites."
              </blockquote>
              
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Home Cook & Food Enthusiast</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 bg-souschef-red">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Meal Planning?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join SousChef today and discover the joy of AI-powered meal planning.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-souschef-red hover:bg-gray-100 btn-hover">
                  <Link to="/signup">Create Free Account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 btn-hover">
                  <Link to="/features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 bg-gray-900 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <Logo className="bg-white" linkClassName="text-white" />
                <p className="mt-4 text-gray-400">
                  AI-powered meal planning and recipe generation.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                  <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                  <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                  <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms</Link></li>
                  <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy</Link></li>
                  <li><Link to="/cookies" className="text-gray-400 hover:text-white">Cookies</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>© {new Date().getFullYear()} SousChef. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;


import React from 'react';
import { 
  ChefHat, 
  Flame, 
  Utensils, 
  Calendar, 
  CircleUser, 
  ShoppingBag 
} from 'lucide-react';

const features = [
  {
    icon: <ChefHat className="w-6 h-6 text-souschef-red" />,
    title: "AI Recipe Generation",
    description: "Get custom recipes based on your preferences, dietary needs, and available ingredients."
  },
  {
    icon: <Flame className="w-6 h-6 text-souschef-red" />,
    title: "Multiple Cuisine Levels",
    description: "Choose from street food, home cooking, or gourmet depending on your mood and time."
  },
  {
    icon: <Utensils className="w-6 h-6 text-souschef-red" />,
    title: "Ingredient Customization",
    description: "Specify key ingredients you want to use or foods you want to avoid."
  },
  {
    icon: <Calendar className="w-6 h-6 text-souschef-red" />,
    title: "Meal Planning",
    description: "Plan your meals for the day, week, or month with easy scheduling and variety."
  },
  {
    icon: <CircleUser className="w-6 h-6 text-souschef-red" />,
    title: "Personalized Experience",
    description: "The AI learns your preferences over time for increasingly personalized suggestions."
  },
  {
    icon: <ShoppingBag className="w-6 h-6 text-souschef-red" />,
    title: "Shopping Lists",
    description: "Automatically generate shopping lists based on your meal plans."
  }
];

export function Features() {
  return (
    <section className="py-20 bg-souschef-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simplify Your Meal Planning</h2>
          <p className="text-lg text-gray-600">
            SousChef combines AI technology with your personal preferences to create 
            the perfect meal plan tailored just for you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 will-change-transform"
            >
              <div className="w-12 h-12 rounded-lg bg-souschef-red/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

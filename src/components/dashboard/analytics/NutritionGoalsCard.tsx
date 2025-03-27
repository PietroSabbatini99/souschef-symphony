
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Goal, ShieldAlert, AlertCircle } from 'lucide-react';

interface DietaryPreferences {
  dailyCalorieGoal?: number;
  weeklyCalorieGoal?: number;
  allergens?: string[];
}

interface NutritionGoalsCardProps {
  userPreferences: DietaryPreferences;
  onUpdatePreferences: () => void;
}

export const NutritionGoalsCard: React.FC<NutritionGoalsCardProps> = ({ 
  userPreferences, 
  onUpdatePreferences 
}) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Goal className="h-5 w-5 text-souschef-red" />
          Nutrition Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userPreferences.dailyCalorieGoal ? (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Daily Calorie Goal:</span>
              <Badge variant="outline" className="text-souschef-red">
                {userPreferences.dailyCalorieGoal} kcal
              </Badge>
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">No daily calorie goal set</span>
            </div>
          )}
          
          {userPreferences.weeklyCalorieGoal ? (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Weekly Calorie Goal:</span>
              <Badge variant="outline" className="text-souschef-red">
                {userPreferences.weeklyCalorieGoal} kcal
              </Badge>
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">No weekly calorie goal set</span>
            </div>
          )}
          
          {userPreferences.allergens && userPreferences.allergens.length > 0 ? (
            <div className="space-y-2">
              <span className="text-sm font-medium">Allergens to avoid:</span>
              <div className="flex flex-wrap gap-2">
                {userPreferences.allergens.map((allergen, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 text-red-600 border-red-200">
                    <ShieldAlert className="h-3 w-3 mr-1" />
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">No allergens specified</span>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
            onClick={onUpdatePreferences}
          >
            Update Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

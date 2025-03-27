import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Flame, Goal, ShieldAlert, Save } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DietaryPreferences, UserPreferencesFormValues } from './types';

// Form schema for user preferences
const userPreferencesSchema = z.object({
  dailyCalorieGoal: z.string().refine(val => !val || !isNaN(Number(val)), {
    message: "Calorie goal must be a number"
  }),
  weeklyCalorieGoal: z.string().refine(val => !val || !isNaN(Number(val)), {
    message: "Weekly calorie goal must be a number"
  }),
  allergens: z.string(),
});

interface PreferencesFormProps {
  initialPreferences: DietaryPreferences;
  onSubmit: (values: UserPreferencesFormValues) => Promise<void>;
  isLoading: boolean;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({ 
  initialPreferences, 
  onSubmit, 
  isLoading 
}) => {
  const form = useForm<UserPreferencesFormValues>({
    resolver: zodResolver(userPreferencesSchema),
    defaultValues: {
      dailyCalorieGoal: initialPreferences.dailyCalorieGoal?.toString() || '',
      weeklyCalorieGoal: initialPreferences.weeklyCalorieGoal?.toString() || '',
      allergens: (initialPreferences.allergens || []).join(', '),
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nutrition Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dailyCalorieGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-souschef-red" />
                      Daily Calorie Goal
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 2000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Target calories per day (leave empty if no goal)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weeklyCalorieGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Goal className="h-4 w-4 text-souschef-red" />
                      Weekly Calorie Goal
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 14000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Target calories per week (leave empty if no goal)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="allergens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-souschef-red" />
                    Allergens
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. peanuts, shellfish, dairy (comma-separated list)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Add foods you're allergic to as a comma-separated list
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full md:w-auto bg-souschef-red hover:bg-souschef-red-light text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

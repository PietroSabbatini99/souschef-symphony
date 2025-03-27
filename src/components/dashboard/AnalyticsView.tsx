import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Sparkles, Flame, Goal, ShieldAlert, Save, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Sample data for analytics - this would be real data in production
const cuisineData = [
  { name: 'Italian', value: 8 },
  { name: 'Mexican', value: 5 },
  { name: 'Chinese', value: 4 },
  { name: 'Indian', value: 3 },
  { name: 'Thai', value: 2 },
];

const mealTypesData = [
  { name: 'Breakfast', count: 6 },
  { name: 'Lunch', count: 9 },
  { name: 'Dinner', count: 12 },
  { name: 'Snack', count: 3 },
];

const weeklyActivityData = [
  { day: 'Mon', recipes: 2, meals: 3, calories: 2100 },
  { day: 'Tue', recipes: 1, meals: 2, calories: 1900 },
  { day: 'Wed', recipes: 0, meals: 3, calories: 2200 },
  { day: 'Thu', recipes: 3, meals: 3, calories: 2000 },
  { day: 'Fri', recipes: 1, meals: 2, calories: 1850 },
  { day: 'Sat', recipes: 4, meals: 4, calories: 2400 },
  { day: 'Sun', recipes: 2, meals: 3, calories: 2150 },
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];

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

type UserPreferencesFormValues = z.infer<typeof userPreferencesSchema>;

// Interface for dietary preferences to ensure type safety
interface DietaryPreferences {
  dailyCalorieGoal?: number;
  weeklyCalorieGoal?: number;
  allergens?: string[];
}

export function AnalyticsView() {
  const { user } = useAuth();
  const [tabView, setTabView] = useState('insights');
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<DietaryPreferences>({});

  const form = useForm<UserPreferencesFormValues>({
    resolver: zodResolver(userPreferencesSchema),
    defaultValues: {
      dailyCalorieGoal: '',
      weeklyCalorieGoal: '',
      allergens: '',
    },
  });

  // Fetch user preferences from profiles table
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('dietary_preferences')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data && data.dietary_preferences) {
          const preferences = data.dietary_preferences as DietaryPreferences;
          
          setUserPreferences({
            dailyCalorieGoal: preferences.dailyCalorieGoal,
            weeklyCalorieGoal: preferences.weeklyCalorieGoal,
            allergens: preferences.allergens || [],
          });
          
          form.setValue('dailyCalorieGoal', preferences.dailyCalorieGoal?.toString() || '');
          form.setValue('weeklyCalorieGoal', preferences.weeklyCalorieGoal?.toString() || '');
          form.setValue('allergens', (preferences.allergens || []).join(', '));
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };
    
    fetchUserPreferences();
  }, [user, form]);

  const onSubmit = async (values: UserPreferencesFormValues) => {
    if (!user) {
      toast.error("You must be logged in to save preferences");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Process allergens into array
      const allergensArray = values.allergens
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
      
      // Prepare the dietary preferences object
      const dietaryPreferences: DietaryPreferences = {
        dailyCalorieGoal: values.dailyCalorieGoal ? parseInt(values.dailyCalorieGoal) : undefined,
        weeklyCalorieGoal: values.weeklyCalorieGoal ? parseInt(values.weeklyCalorieGoal) : undefined,
        allergens: allergensArray,
      };
      
      // Update the profile
      const { error } = await supabase
        .from('profiles')
        .update({
          dietary_preferences: dietaryPreferences,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUserPreferences(dietaryPreferences);
      
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-gray-600">Insights about your cooking habits and dietary goals</p>
        </div>
        <Badge className="bg-souschef-red/10 text-souschef-red border-souschef-red/20 px-3 py-1.5 flex items-center gap-1.5">
          <Sparkles size={14} />
          Beta
        </Badge>
      </div>
      
      <Tabs 
        defaultValue="insights" 
        value={tabView} 
        onValueChange={setTabView}
        className="mb-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="h-5 w-5 text-souschef-red" />
                  Calorie Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyActivityData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      name="Daily Calories" 
                      stroke="#FF6B6B" 
                      activeDot={{ r: 8 }} 
                    />
                    {userPreferences.dailyCalorieGoal && (
                      <Line 
                        type="monotone" 
                        dataKey={() => userPreferences.dailyCalorieGoal} 
                        name="Calorie Goal" 
                        stroke="#4ECDC4" 
                        strokeDasharray="5 5" 
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cuisine Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cuisineData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {cuisineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meal Types</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mealTypesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FF6B6B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
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
                    onClick={() => setTabView('preferences')}
                  >
                    Update Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-6">
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
        </TabsContent>
      </Tabs>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyActivityData}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="recipes" name="Recipes Created" fill="#4ECDC4" />
              <Bar dataKey="meals" name="Meals Planned" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

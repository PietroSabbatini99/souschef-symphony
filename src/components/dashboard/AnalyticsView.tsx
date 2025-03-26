
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  { day: 'Mon', recipes: 2, meals: 3 },
  { day: 'Tue', recipes: 1, meals: 2 },
  { day: 'Wed', recipes: 0, meals: 3 },
  { day: 'Thu', recipes: 3, meals: 3 },
  { day: 'Fri', recipes: 1, meals: 2 },
  { day: 'Sat', recipes: 4, meals: 4 },
  { day: 'Sun', recipes: 2, meals: 3 },
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];

export function AnalyticsView() {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-gray-600">Insights about your cooking habits</p>
        </div>
        <Badge className="bg-souschef-red/10 text-souschef-red border-souschef-red/20 px-3 py-1.5 flex items-center gap-1.5">
          <Sparkles size={14} />
          Beta
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}


import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface WeeklyActivityChartProps {
  data: Array<{
    day: string;
    recipes: number;
    meals: number;
    [key: string]: any;
  }>;
}

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ data }) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
  );
};

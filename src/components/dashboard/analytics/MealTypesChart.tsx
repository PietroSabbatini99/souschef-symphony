
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { MealTypeDataPoint } from './types';

interface MealTypesChartProps {
  data: MealTypeDataPoint[];
}

export const MealTypesChart: React.FC<MealTypesChartProps> = ({ data }) => {
  // Transform data to ensure it has the correct format for the chart
  const chartData = data.map(item => ({
    name: item.name,
    count: item.count || item.value || 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Meal Types</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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
  );
};


import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';

interface CalorieTrackingChartProps {
  data: Array<{
    day: string;
    calories: number;
    [key: string]: any;
  }>;
  dailyCalorieGoal?: number;
}

export const CalorieTrackingChart: React.FC<CalorieTrackingChartProps> = ({ 
  data, 
  dailyCalorieGoal 
}) => {
  return (
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
            <Line 
              type="monotone" 
              dataKey="calories" 
              name="Daily Calories" 
              stroke="#FF6B6B" 
              activeDot={{ r: 8 }} 
            />
            {dailyCalorieGoal && (
              <>
                <ReferenceLine 
                  y={dailyCalorieGoal} 
                  stroke="#4ECDC4" 
                  strokeWidth={2}
                  isFront={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="goal" 
                  name="Calorie Goal" 
                  stroke="#4ECDC4" 
                  activeDot={false}
                  dot={false}
                  legendType="line"
                  hide={true}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

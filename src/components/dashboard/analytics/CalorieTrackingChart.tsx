
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
              left: 20,
              bottom: 30,
            }}
          >
            <XAxis 
              dataKey="day" 
              axisLine={true} 
              tickLine={true} 
            />
            <YAxis 
              axisLine={true} 
              tickLine={true}
              domain={[0, 'dataMax + 200']}
            />
            <Tooltip />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="line"
              wrapperStyle={{ paddingTop: "20px" }}
            />
            <Line 
              type="monotone" 
              dataKey="calories" 
              name="Daily calories" 
              stroke="#FF6B6B" 
              strokeWidth={3}
              dot={{ stroke: '#FF6B6B', strokeWidth: 2, r: 5, fill: 'white' }}
              activeDot={{ r: 8 }} 
            />
            {dailyCalorieGoal && (
              <Line 
                type="monotone" 
                dataKey={() => dailyCalorieGoal}
                name="Calories goal" 
                stroke="#4ECDC4" 
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

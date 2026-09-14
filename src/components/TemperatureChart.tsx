import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyForecast } from '../types/weather';
import { useMemo } from 'react';

interface TemperatureChartProps {
  daily: DailyForecast;
}

export default function TemperatureChart({ daily }: TemperatureChartProps) {
  const data = useMemo(() => {
    return daily.time.map((timeStr, index) => {
      const date = new Date(timeStr);
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
      
      return {
        name: dayName,
        high: daily.temperature_2m_max[index],
        low: daily.temperature_2m_min[index],
      };
    });
  }, [daily]);

  return (
    <div className="w-full h-[300px] mt-8 bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">7-Day Temperature Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => `${Math.round(value)}°`}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
            }}
            formatter={(value: number) => [`${Math.round(value)}°C`]}
            labelStyle={{ color: '#0f172a', fontWeight: 600, marginBottom: '4px' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line 
            type="monotone" 
            name="High"
            dataKey="high" 
            stroke="#ef4444" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            name="Low"
            dataKey="low" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

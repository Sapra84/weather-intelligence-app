import { Droplets, Wind } from 'lucide-react';
import { DailyForecast } from '../types/weather';
import { getWeatherCondition } from '../utils/weatherCodes';
import { cn } from '../lib/utils';

interface DailyForecastCardsProps {
  daily: DailyForecast;
}

export default function DailyForecastCards({ daily }: DailyForecastCardsProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">7-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {daily.time.map((timeStr, index) => {
          const date = new Date(timeStr);
          const isToday = index === 0;
          const dayName = isToday ? 'Today' : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
          const condition = getWeatherCondition(daily.weather_code[index]);
          const high = Math.round(daily.temperature_2m_max[index]);
          const low = Math.round(daily.temperature_2m_min[index]);
          const precip = daily.precipitation_probability_max[index];

          return (
            <div 
              key={timeStr} 
              className={cn(
                "flex flex-col items-center p-4 rounded-xl border transition-all",
                isToday 
                  ? "bg-blue-50/80 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" 
                  : "bg-white/60 border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
              )}
            >
              <span className={cn("text-sm font-medium", isToday ? "text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-400")}>
                {dayName}
              </span>
              
              <div className="text-3xl my-3" title={condition.description}>
                {condition.emoji}
              </div>
              
              <div className="flex gap-2 text-sm font-semibold mb-2">
                <span className="text-slate-900 dark:text-slate-100">{high}°</span>
                <span className="text-slate-400 dark:text-slate-500">{low}°</span>
              </div>
              
              <div className="flex items-center text-xs text-blue-500 dark:text-blue-400 font-medium">
                <Droplets className="w-3 h-3 mr-1" />
                {precip}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

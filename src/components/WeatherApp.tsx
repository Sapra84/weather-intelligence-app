import { useState, FormEvent } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, Loader2, AlertCircle } from 'lucide-react';
import { GeocodingResponse, GeocodingResult, WeatherResponse } from '../types/weather';
import { getWeatherCondition } from '../utils/weatherCodes';
import { generateRecommendations } from '../utils/recommendations';
import DailyForecastCards from './DailyForecastCards';
import TemperatureChart from './TemperatureChart';

export default function WeatherApp() {
  const [cityInput, setCityInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<GeocodingResult | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch weather data.');
    return res.json();
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) {
      setError('Please enter a city name to search.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Geocode
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      
      if (!geoRes.ok) throw new Error('Network error while searching for city.');
      
      const geoData: GeocodingResponse = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found — please check the spelling and try again.');
      }
      
      const firstResult = geoData.results[0];
      setLocation(firstResult);

      // 2. Fetch Weather
      const weatherData = await fetchWeather(firstResult.latitude, firstResult.longitude);
      setWeather(weatherData);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLocation(null);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const currentCondition = weather ? getWeatherCondition(weather.current.weather_code) : null;
  const recommendations = weather ? generateRecommendations(weather.current, weather.daily) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans p-4 sm:p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Weather Intelligence</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time forecasts and smart insights</p>
          </div>
          
          <form onSubmit={handleSearch} className="flex relative w-full md:w-96 shadow-sm">
            <input
              type="text"
              placeholder="Search for a city..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-l-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
            />
            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-r-xl transition-colors disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-200 dark:border-red-900/50">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Error</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !weather && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500 dark:text-slate-400">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <h2 className="text-xl font-medium">Ready for a forecast</h2>
            <p className="max-w-sm mt-2 text-sm">Enter a city name above to get current weather, a 7-day forecast, and intelligent planning recommendations.</p>
          </div>
        )}

        {/* Weather Content */}
        {weather && location && currentCondition && (
          <div className="animate-in fade-in duration-500 space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Current Weather Card */}
              <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 text-white/10 text-[200px] pointer-events-none select-none">
                  {currentCondition.emoji}
                </div>
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">{location.name}</h2>
                    <p className="text-blue-100 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {location.country} {location.admin1 ? `• ${location.admin1}` : ''}
                    </p>
                  </div>
                  
                  <div className="mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <span className="text-7xl font-bold tracking-tighter">
                        {Math.round(weather.current.temperature_2m)}°
                      </span>
                      <div className="flex flex-col">
                        <span className="text-2xl font-semibold leading-tight">{currentCondition.description}</span>
                        <span className="text-blue-100 text-sm">Feels like {Math.round(weather.current.apparent_temperature)}°</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-6 text-sm font-medium">
                      <div className="flex flex-col items-center gap-1.5 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                        <Wind className="w-5 h-5 text-blue-200" />
                        <span>{weather.current.wind_speed_10m} km/h</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                        <Droplets className="w-5 h-5 text-blue-200" />
                        <span>{weather.current.relative_humidity_2m}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations Card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 p-1.5 rounded-lg">
                    💡
                  </span>
                  Smart Insights
                </h3>
                <ul className="space-y-4 flex-grow flex flex-col justify-center">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <p className="leading-relaxed text-sm md:text-base">{rec}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <TemperatureChart daily={weather.daily} />
            
            <DailyForecastCards daily={weather.daily} />
            
          </div>
        )}
      </div>
    </div>
  );
}

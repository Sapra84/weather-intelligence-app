import { CurrentWeather, DailyForecast } from '../types/weather';

export function generateRecommendations(current: CurrentWeather, daily: DailyForecast): string[] {
  const recommendations: string[] = [];

  // Check today's precipitation probability
  const todayPrecipProb = daily.precipitation_probability_max[0] || 0;
  if (todayPrecipProb > 50) {
    recommendations.push("High chance of rain — carry an umbrella.");
  }

  // Check temperature
  const currentTemp = current.temperature_2m;
  if (currentTemp > 35) {
    recommendations.push("Very hot — stay hydrated and avoid prolonged sun exposure.");
  } else if (currentTemp < 10) {
    recommendations.push("Cold — dress warmly in layers.");
  } else if (currentTemp >= 15 && currentTemp <= 25 && todayPrecipProb < 20) {
    recommendations.push("Great day to be outdoors — enjoy the mild weather.");
  }

  // Check wind
  const currentWind = current.wind_speed_10m;
  if (currentWind > 30) {
    recommendations.push("It's quite windy — secure loose outdoor items.");
  }

  // Check humidity if hot
  if (currentTemp > 25 && current.relative_humidity_2m > 70) {
    recommendations.push("High humidity makes it feel warmer — take it easy.");
  }

  // Ensure we return at least 1 and up to 3 recommendations
  if (recommendations.length === 0) {
    recommendations.push("Typical weather conditions today.");
  }

  return recommendations.slice(0, 3);
}

export interface WeatherCondition {
  description: string;
  emoji: string;
}

// Map Open-Meteo WMO weather_code values
// 0 clear; 1-3 partly cloudy; 45/48 fog; 51-67 drizzle/rain; 71-77 snow; 80-82 showers; 95-99 thunderstorm
export function getWeatherCondition(code: number): WeatherCondition {
  switch (code) {
    case 0:
      return { description: 'Clear sky', emoji: '☀️' };
    case 1:
      return { description: 'Mainly clear', emoji: '🌤️' };
    case 2:
      return { description: 'Partly cloudy', emoji: '⛅' };
    case 3:
      return { description: 'Overcast', emoji: '☁️' };
    case 45:
    case 48:
      return { description: 'Fog', emoji: '🌫️' };
    case 51:
    case 53:
    case 55:
      return { description: 'Drizzle', emoji: '🌧️' };
    case 56:
    case 57:
      return { description: 'Freezing Drizzle', emoji: '❄️' };
    case 61:
    case 63:
    case 65:
      return { description: 'Rain', emoji: '🌧️' };
    case 66:
    case 67:
      return { description: 'Freezing Rain', emoji: '❄️' };
    case 71:
    case 73:
    case 75:
      return { description: 'Snow fall', emoji: '❄️' };
    case 77:
      return { description: 'Snow grains', emoji: '❄️' };
    case 80:
    case 81:
    case 82:
      return { description: 'Rain showers', emoji: '🌦️' };
    case 85:
    case 86:
      return { description: 'Snow showers', emoji: '🌨️' };
    case 95:
      return { description: 'Thunderstorm', emoji: '⛈️' };
    case 96:
    case 99:
      return { description: 'Thunderstorm with hail', emoji: '⛈️' };
    default:
      return { description: 'Unknown', emoji: '❓' };
  }
}

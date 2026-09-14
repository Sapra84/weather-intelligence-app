# Weather Intelligence

A client-side single-page React application that provides weather forecasts and intelligence based on the public Open-Meteo API.

## Features
- **City Search**: Uses the Open-Meteo Geocoding API to find coordinates for a given city name.
- **Current Weather**: Displays current temperature, apparent temperature ("feels like"), humidity, wind speed, and weather condition.
- **7-Day Forecast**: Shows a daily breakdown of highs, lows, precipitation probability, and conditions.
- **Visual Insights**: A line chart visualizes the high and low temperature trends over the week.
- **Planning Recommendations**: Offers simple, rule-based suggestions (e.g., "Carry an umbrella", "Stay hydrated") based on the forecast data.

## APIs Used
This application uses the open, free-to-use APIs provided by [Open-Meteo](https://open-meteo.com/):
- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search`
- **Forecast API**: `https://api.open-meteo.com/v1/forecast`

No API keys or backend servers are required to run this application.

## Local Development

### Prerequisites
- Node.js (v18+)
- npm

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
   The built assets will be in the `dist` directory.

## Deployment to Cloudflare Pages
This project is configured as a standard Vite application, making it easy to deploy to Cloudflare Pages:
1. Connect your GitHub repository to Cloudflare Pages.
2. Set the build command to `npm run build`.
3. Set the build output directory to `dist`.
4. The included `public/_redirects` file ensures that client-side routing works correctly when deployed.

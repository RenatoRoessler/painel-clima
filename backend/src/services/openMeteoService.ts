import { WeatherData, OpenMeteoResponse } from '../types/weather.types';

export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
  cityName: string
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,uv_index,weather_code',
    hourly: 'temperature_2m,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
    timezone: 'auto',
    forecast_days: '7',
    wind_speed_unit: 'kmh',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`);
  }

  const data = await response.json() as OpenMeteoResponse;

  const hourly = data.hourly.time.slice(0, 24).map((time, i) => ({
    time,
    temperature: data.hourly.temperature_2m[i],
    precipitationProbability: data.hourly.precipitation_probability[i],
  }));

  const daily = data.daily.time.map((date, i) => ({
    date,
    temperatureMax: data.daily.temperature_2m_max[i],
    temperatureMin: data.daily.temperature_2m_min[i],
    precipitationSum: data.daily.precipitation_sum[i],
    weatherCode: data.daily.weather_code[i],
  }));

  return {
    city: cityName,
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      uvIndex: data.current.uv_index,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
    },
    hourly,
    daily,
  };
}

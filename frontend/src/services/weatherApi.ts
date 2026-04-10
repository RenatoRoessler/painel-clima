import type { WeatherData, WeatherParams } from '../types/weather.types';

const API_BASE = 'http://localhost:3000';

export async function fetchWeather(params: WeatherParams): Promise<WeatherData> {
  let url: string;

  if ('city' in params) {
    url = `${API_BASE}/api/weather?city=${encodeURIComponent(params.city)}`;
  } else {
    url = `${API_BASE}/api/weather?lat=${params.lat}&lon=${params.lon}`;
  }

  const response = await fetch(url);

  if (response.status === 404) {
    throw new Error('not_found');
  }

  if (!response.ok) {
    throw new Error('server_error');
  }

  return response.json() as Promise<WeatherData>;
}

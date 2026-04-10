import type { WeatherResponse } from '../types/weather';

export async function fetchWeather(city: string): Promise<WeatherResponse> {
  const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

  if (res.status === 404) {
    throw new Error('Cidade não encontrada');
  }

  if (!res.ok) {
    throw new Error(`Erro ao buscar dados: ${res.status}`);
  }

  return res.json() as Promise<WeatherResponse>;
}

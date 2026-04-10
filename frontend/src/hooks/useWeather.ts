import { useState, useCallback } from 'react';
import type { WeatherData, WeatherParams } from '../types/weather.types';
import { fetchWeather } from '../services/weatherApi';

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<'not_found' | 'server_error' | null>(null);

  const search = useCallback(async (params: WeatherParams) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchWeather(params);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'server_error';
      setError(message === 'not_found' ? 'not_found' : 'server_error');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, search };
}

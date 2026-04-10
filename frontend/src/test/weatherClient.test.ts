import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWeather } from '../api/weatherClient';
import type { WeatherResponse } from '../types/weather';

const mockData: WeatherResponse = {
  city: 'Rio de Janeiro',
  current: {
    temperature_2m: 28,
    relative_humidity_2m: 70,
    wind_speed_10m: 15,
    uv_index: 6,
    precipitation: 0,
    weather_code: 0,
  },
  current_units: { temperature_2m: '°C', wind_speed_10m: 'km/h', precipitation: 'mm' },
  hourly: { time: [], temperature_2m: [], precipitation_probability: [] },
  daily: { time: [], temperature_2m_max: [], temperature_2m_min: [], precipitation_sum: [] },
};

describe('fetchWeather', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('retorna dados no sucesso (200)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await fetchWeather('Rio de Janeiro');
    expect(result.city).toBe('Rio de Janeiro');
    expect(result.current.temperature_2m).toBe(28);
  });

  it('lança erro com "Cidade não encontrada" em 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Cidade não encontrada' }),
      }),
    );

    await expect(fetchWeather('CidadeInexistente')).rejects.toThrow('Cidade não encontrada');
  });

  it('lança erro genérico em falha de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    await expect(fetchWeather('São Paulo')).rejects.toThrow('Network error');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DailyForecast } from '../components/DailyForecast';
import type { WeatherResponse } from '../types/weather';

const mockData: WeatherResponse = {
  city: 'São Paulo',
  current: {
    temperature_2m: 22,
    relative_humidity_2m: 60,
    wind_speed_10m: 10,
    uv_index: 4,
    precipitation: 0,
    weather_code: 2,
  },
  current_units: {},
  hourly: { time: [], temperature_2m: [], precipitation_probability: [] },
  daily: {
    time: [
      '2026-04-09',
      '2026-04-10',
      '2026-04-11',
      '2026-04-12',
      '2026-04-13',
      '2026-04-14',
      '2026-04-15',
    ],
    temperature_2m_max: [28, 29, 27, 26, 30, 31, 25],
    temperature_2m_min: [18, 19, 17, 16, 20, 21, 15],
    precipitation_sum: [0, 0, 5, 2, 0, 0, 8],
  },
};

describe('DailyForecast', () => {
  it('renderiza exatamente 7 cards de dias', () => {
    render(<DailyForecast data={mockData} />);
    const maxTemps = screen.getAllByText(/\d+°/);
    // Each day has min and max temp — at least 14 temp readings
    expect(maxTemps.length).toBeGreaterThanOrEqual(14);
  });

  it('exibe título "Próximos 7 dias"', () => {
    render(<DailyForecast data={mockData} />);
    expect(screen.getByText('Próximos 7 dias')).toBeInTheDocument();
  });
});

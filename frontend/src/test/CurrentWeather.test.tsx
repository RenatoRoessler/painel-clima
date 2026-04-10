import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CurrentWeather } from '../components/CurrentWeather';
import type { WeatherResponse } from '../types/weather';

const mockData: WeatherResponse = {
  city: 'Rio de Janeiro',
  current: {
    temperature_2m: 30,
    relative_humidity_2m: 75,
    wind_speed_10m: 20,
    uv_index: 8,
    precipitation: 2.5,
    weather_code: 61,
  },
  current_units: { temperature_2m: '°C', wind_speed_10m: 'km/h', precipitation: 'mm' },
  hourly: { time: [], temperature_2m: [], precipitation_probability: [] },
  daily: { time: [], temperature_2m_max: [], temperature_2m_min: [], precipitation_sum: [] },
};

describe('CurrentWeather', () => {
  it('renderiza o nome da cidade', () => {
    render(<CurrentWeather data={mockData} />);
    expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument();
  });

  it('renderiza a temperatura atual', () => {
    render(<CurrentWeather data={mockData} />);
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('renderiza umidade', () => {
    render(<CurrentWeather data={mockData} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renderiza velocidade do vento', () => {
    render(<CurrentWeather data={mockData} />);
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('renderiza barra UV', () => {
    render(<CurrentWeather data={mockData} />);
    expect(screen.getByText(/Índice UV/i)).toBeInTheDocument();
  });
});

export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog';

export function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2 || code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95 && code <= 99) return 'storm';
  return 'clear';
}

export function getTemperatureGradient(temp: number): string {
  if (temp < 0) return 'linear-gradient(135deg, #1a1a4e, #2d2d8f)';
  if (temp < 10) return 'linear-gradient(135deg, #1e3a5f, #2196F3)';
  if (temp < 20) return 'linear-gradient(135deg, #0d47a1, #00bcd4)';
  if (temp < 28) return 'linear-gradient(135deg, #1b5e20, #4caf50)';
  if (temp < 35) return 'linear-gradient(135deg, #e65100, #ff9800)';
  return 'linear-gradient(135deg, #b71c1c, #f44336)';
}

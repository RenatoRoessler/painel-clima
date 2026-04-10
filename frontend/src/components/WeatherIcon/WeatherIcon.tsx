import type { ComponentType } from 'react';
import { getWeatherCondition, type WeatherCondition } from '../../utils/weatherUtils';
import { SunIcon } from './icons/SunIcon';
import { CloudIcon } from './icons/CloudIcon';
import { RainIcon } from './icons/RainIcon';
import { StormIcon } from './icons/StormIcon';
import { SnowIcon } from './icons/SnowIcon';
import { FogIcon } from './icons/FogIcon';

interface WeatherIconProps {
  weatherCode: number;
  size?: number;
}

const iconMap: Record<WeatherCondition, ComponentType<{ size?: number }>> = {
  clear: SunIcon,
  cloudy: CloudIcon,
  rain: RainIcon,
  storm: StormIcon,
  snow: SnowIcon,
  fog: FogIcon,
};

export function WeatherIcon({ weatherCode, size = 80 }: WeatherIconProps) {
  const condition = getWeatherCondition(weatherCode);
  const Icon = iconMap[condition];
  return <Icon size={size} />;
}

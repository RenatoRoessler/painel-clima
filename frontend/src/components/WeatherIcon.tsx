import styled, { keyframes } from 'styled-components';

interface WeatherIconProps {
  code: number;
  size?: number;
}

interface IconConfig {
  icon: string;
  animation: 'spin' | 'pulse' | 'sway' | 'bounce' | 'none';
  label: string;
}

const WEATHER_CODE_MAP: Record<number, IconConfig> = {
  0: { icon: '☀️', animation: 'spin', label: 'Céu limpo' },
  1: { icon: '🌤️', animation: 'sway', label: 'Principalmente limpo' },
  2: { icon: '⛅', animation: 'sway', label: 'Parcialmente nublado' },
  3: { icon: '☁️', animation: 'pulse', label: 'Nublado' },
  45: { icon: '🌫️', animation: 'pulse', label: 'Névoa' },
  48: { icon: '🌫️', animation: 'pulse', label: 'Névoa com gelo' },
  51: { icon: '🌦️', animation: 'bounce', label: 'Garoa leve' },
  53: { icon: '🌦️', animation: 'bounce', label: 'Garoa moderada' },
  55: { icon: '🌧️', animation: 'bounce', label: 'Garoa intensa' },
  61: { icon: '🌧️', animation: 'bounce', label: 'Chuva leve' },
  63: { icon: '🌧️', animation: 'bounce', label: 'Chuva moderada' },
  65: { icon: '🌧️', animation: 'bounce', label: 'Chuva intensa' },
  71: { icon: '🌨️', animation: 'bounce', label: 'Neve leve' },
  73: { icon: '🌨️', animation: 'bounce', label: 'Neve moderada' },
  75: { icon: '❄️', animation: 'spin', label: 'Neve intensa' },
  80: { icon: '🌦️', animation: 'bounce', label: 'Pancadas leves' },
  81: { icon: '🌧️', animation: 'bounce', label: 'Pancadas moderadas' },
  82: { icon: '⛈️', animation: 'bounce', label: 'Pancadas intensas' },
  95: { icon: '⛈️', animation: 'pulse', label: 'Tempestade' },
  96: { icon: '⛈️', animation: 'pulse', label: 'Tempestade com granizo' },
  99: { icon: '⛈️', animation: 'pulse', label: 'Tempestade com granizo intenso' },
};

const DEFAULT_ICON: IconConfig = { icon: '🌡️', animation: 'none', label: 'Clima' };

export function WeatherIcon({ code, size = 48 }: WeatherIconProps) {
  const config = WEATHER_CODE_MAP[code] ?? DEFAULT_ICON;
  return (
    <IconWrapper $size={size} $animation={config.animation} aria-label={config.label} title={config.label}>
      {config.icon}
    </IconWrapper>
  );
}

const spinAnim = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulseAnim = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const swayAnim = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
`;

const bounceAnim = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const ANIMATION_MAP = {
  spin: spinAnim,
  pulse: pulseAnim,
  sway: swayAnim,
  bounce: bounceAnim,
  none: null,
};

const IconWrapper = styled.span<{ $size: number; $animation: keyof typeof ANIMATION_MAP }>`
  display: inline-block;
  font-size: ${({ $size }) => $size}px;
  line-height: 1;
  animation: ${({ $animation }) => {
    const anim = ANIMATION_MAP[$animation];
    return anim ? anim : 'none';
  }} ${({ $animation }) => ($animation === 'spin' ? '8s' : '2s')} linear infinite;
`;

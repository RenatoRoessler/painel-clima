import type { WeatherData } from '../../types/weather.types';
import { WeatherIcon } from '../WeatherIcon/WeatherIcon';
import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader';
import {
  WeeklyContainer,
  SectionTitle,
  DayRow,
  DayName,
  TempRange,
  TempMin,
  TempMax,
  TempBarTrack,
  TempBarFill,
} from './WeeklyForecast.styles';

interface WeeklyForecastProps {
  data: WeatherData | null;
  loading: boolean;
}

const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatDay(dateStr: string, index: number): string {
  if (index === 0) return 'Hoje';
  const date = new Date(dateStr + 'T12:00:00');
  return DAYS_PT[date.getDay()];
}

export function WeeklyForecast({ data, loading }: WeeklyForecastProps) {
  if (loading) {
    return (
      <WeeklyContainer>
        <SectionTitle>Próximos 7 Dias</SectionTitle>
        {[...Array(7)].map((_, i) => (
          <SkeletonLoader key={i} variant="card" height="44px" />
        ))}
      </WeeklyContainer>
    );
  }

  if (!data) return null;

  const { daily } = data;
  const weekMin = Math.min(...daily.map((d) => d.temperatureMin));
  const weekMax = Math.max(...daily.map((d) => d.temperatureMax));
  const range = weekMax - weekMin || 1;

  return (
    <WeeklyContainer>
      <SectionTitle>Próximos 7 Dias</SectionTitle>
      {daily.map((day, index) => {
        const left = ((day.temperatureMin - weekMin) / range) * 100;
        const width = ((day.temperatureMax - day.temperatureMin) / range) * 100;

        return (
          <DayRow key={day.date}>
            <DayName>{formatDay(day.date, index)}</DayName>
            <WeatherIcon weatherCode={day.weatherCode} size={28} />
            <TempRange>
              <TempMin>{Math.round(day.temperatureMin)}°</TempMin>
              <TempBarTrack>
                <TempBarFill $left={left} $width={width} />
              </TempBarTrack>
              <TempMax>{Math.round(day.temperatureMax)}°</TempMax>
            </TempRange>
          </DayRow>
        );
      })}
    </WeeklyContainer>
  );
}

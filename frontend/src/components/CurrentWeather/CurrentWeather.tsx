import type { WeatherData } from '../../types/weather.types';
import { WeatherIcon } from '../WeatherIcon/WeatherIcon';
import { UVBar } from '../UVBar/UVBar';
import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader';
import {
  WeatherHeader,
  CityName,
  Temperature,
  FeelsLike,
  CardsGrid,
  InfoCard,
  InfoLabel,
  InfoValue,
  InfoUnit,
} from './CurrentWeather.styles';

interface CurrentWeatherProps {
  data: WeatherData | null;
  loading: boolean;
}

export function CurrentWeather({ data, loading }: CurrentWeatherProps) {
  if (loading) {
    return (
      <div>
        <WeatherHeader>
          <SkeletonLoader variant="circle" size="80px" />
          <SkeletonLoader variant="line" width="200px" />
          <SkeletonLoader variant="line" width="120px" />
        </WeatherHeader>
        <CardsGrid>
          {[...Array(5)].map((_, i) => (
            <SkeletonLoader key={i} variant="card" height="90px" />
          ))}
        </CardsGrid>
      </div>
    );
  }

  if (!data) return null;

  const { city, current } = data;

  return (
    <div>
      <WeatherHeader>
        <WeatherIcon weatherCode={current.weatherCode} size={80} />
        <CityName>{city}</CityName>
        <Temperature>{Math.round(current.temperature)}<InfoUnit>°C</InfoUnit></Temperature>
        <FeelsLike>Sensação térmica {Math.round(current.feelsLike)}°C</FeelsLike>
      </WeatherHeader>

      <CardsGrid>
        <InfoCard>
          <InfoLabel>Umidade</InfoLabel>
          <InfoValue>{current.humidity}<InfoUnit>%</InfoUnit></InfoValue>
        </InfoCard>
        <InfoCard>
          <InfoLabel>Vento</InfoLabel>
          <InfoValue>{Math.round(current.windSpeed)}<InfoUnit> km/h</InfoUnit></InfoValue>
        </InfoCard>
        <InfoCard>
          <InfoLabel>Precipitação</InfoLabel>
          <InfoValue>{current.precipitation}<InfoUnit> mm</InfoUnit></InfoValue>
        </InfoCard>
        <InfoCard style={{ gridColumn: 'span 2' }}>
          <InfoLabel>Índice UV</InfoLabel>
          <UVBar uvIndex={current.uvIndex} />
        </InfoCard>
      </CardsGrid>
    </div>
  );
}

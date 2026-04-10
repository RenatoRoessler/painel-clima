import styled from 'styled-components';
import type { WeatherResponse } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { UVBar } from './UVBar';

interface CurrentWeatherProps {
  data: WeatherResponse;
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const { current, current_units, city } = data;

  return (
    <Container>
      <CityName>{city}</CityName>

      <MainSection>
        <WeatherIcon code={current.weather_code} size={80} />
        <Temperature>
          {Math.round(current.temperature_2m)}
          <Unit>{current_units.temperature_2m ?? '°C'}</Unit>
        </Temperature>
      </MainSection>

      <Grid>
        <Card>
          <CardIcon>💧</CardIcon>
          <CardValue>{current.relative_humidity_2m}%</CardValue>
          <CardLabel>Umidade</CardLabel>
        </Card>
        <Card>
          <CardIcon>💨</CardIcon>
          <CardValue>
            {Math.round(current.wind_speed_10m)}
            <small> {current_units.wind_speed_10m ?? 'km/h'}</small>
          </CardValue>
          <CardLabel>Vento</CardLabel>
        </Card>
        <Card>
          <CardIcon>🌧️</CardIcon>
          <CardValue>
            {current.precipitation}
            <small> {current_units.precipitation ?? 'mm'}</small>
          </CardValue>
          <CardLabel>Precipitação</CardLabel>
        </Card>
      </Grid>

      <UVSection>
        <UVBar value={current.uv_index} />
      </UVSection>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 20px;
  color: #fff;
`;

const CityName = styled.h2`
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 700;
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const MainSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Temperature = styled.div`
  font-size: clamp(56px, 10vw, 80px);
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
`;

const Unit = styled.span`
  font-size: 0.4em;
  font-weight: 400;
  vertical-align: top;
  margin-top: 12px;
  display: inline-block;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 480px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
`;

const CardIcon = styled.div`
  font-size: 22px;
  margin-bottom: 6px;
`;

const CardValue = styled.div`
  font-size: 18px;
  font-weight: 700;

  small {
    font-size: 12px;
    font-weight: 400;
    opacity: 0.8;
  }
`;

const CardLabel = styled.div`
  font-size: 12px;
  opacity: 0.75;
  margin-top: 4px;
`;

const UVSection = styled.div`
  width: 100%;
  max-width: 480px;
`;

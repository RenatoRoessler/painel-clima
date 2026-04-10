import styled from 'styled-components';
import type { WeatherResponse } from '../types/weather';

interface DailyForecastProps {
  data: WeatherResponse;
}

function formatDay(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function DailyForecast({ data }: DailyForecastProps) {
  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum } = data.daily;

  const allTemps = [...temperature_2m_max, ...temperature_2m_min];
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = globalMax - globalMin || 1;

  return (
    <Container>
      <Title>Próximos 7 dias</Title>
      <List>
        {time.map((dateStr, i) => {
          const minBar = ((temperature_2m_min[i] - globalMin) / range) * 100;
          const barWidth = ((temperature_2m_max[i] - temperature_2m_min[i]) / range) * 100;

          return (
            <DayCard key={dateStr}>
              <DayName>{formatDay(dateStr)}</DayName>
              <TempRange>
                <TempMin>{Math.round(temperature_2m_min[i])}°</TempMin>
                <BarTrack>
                  <BarFill style={{ marginLeft: `${minBar}%`, width: `${barWidth}%` }} />
                </BarTrack>
                <TempMax>{Math.round(temperature_2m_max[i])}°</TempMax>
              </TempRange>
              {precipitation_sum[i] > 0 && (
                <Precip>🌧️ {precipitation_sum[i].toFixed(1)} mm</Precip>
              )}
            </DayCard>
          );
        })}
      </List>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  color: #fff;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
  opacity: 0.9;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DayCard = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 12px 16px;

  @media (max-width: 480px) {
    grid-template-columns: 90px 1fr auto;
    font-size: 13px;
  }
`;

const DayName = styled.span`
  font-size: 13px;
  opacity: 0.85;
  text-transform: capitalize;
`;

const TempRange = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TempMin = styled.span`
  font-size: 13px;
  opacity: 0.7;
  min-width: 28px;
  text-align: right;
`;

const TempMax = styled.span`
  font-size: 13px;
  font-weight: 600;
  min-width: 28px;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
`;

const BarFill = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  background: linear-gradient(to right, #52b69a, #f77f00);
  border-radius: 3px;
  min-width: 4px;
`;

const Precip = styled.span`
  font-size: 12px;
  opacity: 0.75;
  white-space: nowrap;
`;

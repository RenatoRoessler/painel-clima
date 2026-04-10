import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import styled from 'styled-components';
import type { WeatherResponse } from '../types/weather';

interface HourlyChartProps {
  data: WeatherResponse;
}

interface ChartDataPoint {
  hora: string;
  Temperatura: number;
  Precipitação: number;
}

function buildChartData(data: WeatherResponse): ChartDataPoint[] {
  const { time, temperature_2m, precipitation_probability } = data.hourly;
  const now = new Date();
  const points: ChartDataPoint[] = [];

  for (let i = 0; i < time.length && points.length < 24; i++) {
    const date = new Date(time[i]);
    if (date < now && points.length === 0) continue;
    points.push({
      hora: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      Temperatura: Math.round(temperature_2m[i]),
      Precipitação: precipitation_probability[i],
    });
  }

  return points;
}

export function HourlyChart({ data }: HourlyChartProps) {
  const chartData = buildChartData(data);

  return (
    <Container>
      <Title>Previsão Hora a Hora</Title>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f77f00" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#f77f00" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="precipGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#00b4d8" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="hora"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
              tickLine={false}
              interval={3}
            />
            <YAxis
              yAxisId="temp"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              unit="°"
            />
            <YAxis
              yAxisId="precip"
              orientation="right"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(20,20,40,0.9)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend
              wrapperStyle={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, paddingTop: 8 }}
            />
            <Area
              yAxisId="temp"
              type="monotone"
              dataKey="Temperatura"
              stroke="#f77f00"
              fill="url(#tempGrad)"
              strokeWidth={2}
            />
            <Area
              yAxisId="precip"
              type="monotone"
              dataKey="Precipitação"
              stroke="#00b4d8"
              fill="url(#precipGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
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

const ChartWrapper = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 16px;
`;

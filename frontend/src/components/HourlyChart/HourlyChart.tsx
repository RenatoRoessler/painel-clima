import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import type { WeatherData } from '../../types/weather.types';
import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader';
import { ChartContainer, SectionTitle } from './HourlyChart.styles';

interface HourlyChartProps {
  data: WeatherData | null;
  loading: boolean;
}

function formatHour(isoString: string): string {
  const date = new Date(isoString);
  return `${date.getHours().toString().padStart(2, '0')}h`;
}

export function HourlyChart({ data, loading }: HourlyChartProps) {
  if (loading) {
    return (
      <ChartContainer>
        <SectionTitle>Hora a Hora</SectionTitle>
        <SkeletonLoader variant="card" height="200px" />
      </ChartContainer>
    );
  }

  if (!data) return null;

  const chartData = data.hourly.slice(0, 24).map((h) => ({
    hora: formatHour(h.time),
    'Temp (°C)': Math.round(h.temperature),
    'Chuva (%)': h.precipitationProbability,
  }));

  return (
    <ChartContainer>
      <SectionTitle>Hora a Hora</SectionTitle>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <XAxis dataKey="hora" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} interval={3} />
          <YAxis yAxisId="temp" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
          <YAxis yAxisId="rain" orientation="right" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: 8, color: '#fff' }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
          <Bar yAxisId="rain" dataKey="Chuva (%)" fill="rgba(100, 181, 246, 0.4)" radius={[3, 3, 0, 0]} />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="Temp (°C)"
            stroke="#FFD700"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

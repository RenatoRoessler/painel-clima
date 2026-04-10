export interface WeatherData {
  city: string;
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    precipitation: number;
    weatherCode: number;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    precipitationProbability: number;
  }>;
  daily: Array<{
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    precipitationSum: number;
    weatherCode: number;
  }>;
}

export type WeatherParams =
  | { city: string }
  | { lat: number; lon: number };

export interface AppState {
  data: WeatherData | null;
  loading: boolean;
  error: 'not_found' | 'server_error' | null;
}

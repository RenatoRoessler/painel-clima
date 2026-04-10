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

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface OpenMeteoCurrentResponse {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  wind_speed_10m: number;
  uv_index: number;
  weather_code: number;
}

export interface OpenMeteoResponse {
  current: OpenMeteoCurrentResponse;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
}

import { GeocodingResult, WeatherResponse } from "../types/weather";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

async function geocodeCity(city: string): Promise<GeocodingResult> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1`;
  const res = await fetch(url);
  const data = (await res.json()) as { results?: GeocodingResult[] };

  if (!data.results || data.results.length === 0) {
    const err = new Error("Cidade não encontrada") as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }

  return data.results[0];
}

async function fetchForecast(lat: number, lon: number): Promise<Omit<WeatherResponse, "city">> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,precipitation,weather_code",
    hourly: "temperature_2m,precipitation_probability",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
    timezone: "auto",
    forecast_days: "7",
  });

  const res = await fetch(`${FORECAST_URL}?${params}`);
  return res.json() as Promise<Omit<WeatherResponse, "city">>;
}

export async function getWeatherByCity(city: string): Promise<WeatherResponse> {
  const t0 = Date.now();

  const geo = await geocodeCity(city);
  const tGeo = Date.now() - t0;

  const t1 = Date.now();
  const forecast = await fetchForecast(geo.latitude, geo.longitude);
  const tForecast = Date.now() - t1;

  const total = Date.now() - t0;
  console.log(`[WEATHER] city="${city}" geocoding=${tGeo}ms forecast=${tForecast}ms total=${total}ms`);

  return { ...forecast, city: geo.name };
}

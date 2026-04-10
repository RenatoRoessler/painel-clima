import { useCallback, useRef } from 'react';
import { useWeather } from './hooks/useWeather';
import { useGeolocation } from './hooks/useGeolocation';
import { getTemperatureGradient } from './utils/weatherUtils';
import { SearchBar } from './components/SearchBar/SearchBar';
import { CurrentWeather } from './components/CurrentWeather/CurrentWeather';
import { HourlyChart } from './components/HourlyChart/HourlyChart';
import { WeeklyForecast } from './components/WeeklyForecast/WeeklyForecast';
import {
  AppWrapper,
  ContentWrapper,
  Header,
  AppTitle,
  ErrorBox,
  ErrorTitle,
  ErrorMessage,
  RetryButton,
} from './App.styles';

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #0d47a1, #00bcd4)';

export default function App() {
  const { data, loading, error, search } = useWeather();
  const { getPosition, loading: geoLoading } = useGeolocation();
  const lastSearchRef = useRef<(() => void) | null>(null);

  const gradient = data
    ? getTemperatureGradient(data.current.temperature)
    : DEFAULT_GRADIENT;

  const handleSearch = useCallback(
    (city: string) => {
      lastSearchRef.current = () => search({ city });
      search({ city });
    },
    [search]
  );

  const handleGeolocate = useCallback(async () => {
    try {
      const { lat, lon } = await getPosition();
      lastSearchRef.current = () => search({ lat, lon });
      search({ lat, lon });
    } catch {
      // error handled by useGeolocation
    }
  }, [getPosition, search]);

  const handleRetry = useCallback(() => {
    if (lastSearchRef.current) lastSearchRef.current();
  }, []);

  const isLoading = loading || geoLoading;

  return (
    <AppWrapper $gradient={gradient}>
      <ContentWrapper>
        <Header>
          <AppTitle>Painel de Clima</AppTitle>
          <SearchBar
            onSearch={handleSearch}
            onGeolocate={handleGeolocate}
            loading={isLoading}
          />
        </Header>

        {error && (
          <ErrorBox>
            <ErrorTitle>
              {error === 'not_found' ? '🌍 Cidade não encontrada' : '⚠️ Erro ao buscar dados'}
            </ErrorTitle>
            <ErrorMessage>
              {error === 'not_found'
                ? 'Não encontramos nenhuma cidade com esse nome. Verifique a grafia e tente novamente.'
                : 'Houve um problema ao buscar os dados climáticos. Por favor, tente novamente.'}
            </ErrorMessage>
            <RetryButton onClick={handleRetry}>Tentar novamente</RetryButton>
          </ErrorBox>
        )}

        {(isLoading || data) && !error && (
          <>
            <CurrentWeather data={data} loading={isLoading} />
            <HourlyChart data={data} loading={isLoading} />
            <WeeklyForecast data={data} loading={isLoading} />
          </>
        )}
      </ContentWrapper>
    </AppWrapper>
  );
}

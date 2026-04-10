import { useState, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import type { WeatherResponse } from './types/weather';
import { fetchWeather } from './api/weatherClient';
import { getTemperatureGradient } from './utils/gradientUtils';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyChart } from './components/HourlyChart';
import { DailyForecast } from './components/DailyForecast';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorMessage } from './components/ErrorMessage';

type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: WeatherResponse }
  | { status: 'error'; message: string };

function App() {
  const [state, setState] = useState<AppState>({ status: 'idle' });

  const background =
    state.status === 'success'
      ? getTemperatureGradient(state.data.current.temperature_2m)
      : 'linear-gradient(135deg, #1a1a2e, #16213e)';

  const handleSearch = useCallback(async (city: string) => {
    setState({ status: 'loading' });
    try {
      const data = await fetchWeather(city);
      setState({ status: 'success', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado';
      setState({ status: 'error', message });
    }
  }, []);

  const handleGeolocate = useCallback(() => {
    setState({ status: 'loading' });
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const data = await fetchWeather(`${latitude},${longitude}`);
          setState({ status: 'success', data });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Erro inesperado';
          setState({ status: 'error', message });
        }
      },
      () => {
        setState({
          status: 'error',
          message: 'Permissão de localização negada. Use o campo de busca.',
        });
      },
    );
  }, []);

  const handleRetry = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  const isLoading = state.status === 'loading';

  return (
    <>
      <GlobalStyle />
      <PageWrapper $background={background}>
        <Header>
          <AppTitle>🌤 Painel de Clima</AppTitle>
          <SearchBar onSearch={handleSearch} onGeolocate={handleGeolocate} loading={isLoading} />
        </Header>

        <Main>
          {state.status === 'idle' && (
            <Hint>Digite o nome de uma cidade ou use sua localização para ver o clima.</Hint>
          )}
          {state.status === 'loading' && <SkeletonLoader />}
          {state.status === 'error' && (
            <ErrorMessage message={state.message} onRetry={handleRetry} />
          )}
          {state.status === 'success' && (
            <WeatherContent>
              <CurrentWeather data={state.data} />
              <Section>
                <HourlyChart data={state.data} />
              </Section>
              <Section>
                <DailyForecast data={state.data} />
              </Section>
            </WeatherContent>
          )}
        </Main>
      </PageWrapper>
    </>
  );
}

export default App;

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
`;

const PageWrapper = styled.div<{ $background: string }>`
  min-height: 100dvh;
  background: ${({ $background }) => $background};
  transition: background 0.8s ease;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: 24px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
`;

const AppTitle = styled.h1`
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px 40px;
`;

const Hint = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 60px;
  font-size: 16px;
`;

const WeatherContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.section`
  width: 100%;
`;

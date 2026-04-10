# Tech Spec — Painel de Clima

## Resumo Executivo

A implementação do Painel de Clima será feita sobre a base existente de frontend (React 19 + TypeScript + Vite) e backend (Express 5), com migração do backend para TypeScript. O frontend adicionará styled-components para estilização e Recharts para o gráfico hora a hora. O backend será reestruturado em camadas (rotas, serviços) e passará a expor o endpoint `GET /api/weather` com suporte a busca por cidade ou por coordenadas geográficas. A comunicação com a API pública Open-Meteo será exclusiva do backend. O estado global da aplicação será gerenciado com hooks customizados em React, sem nenhuma biblioteca de state management externa.

---

## Arquitetura do Sistema

### Visão Geral dos Componentes

```
[Usuário]
   │
   ▼
[Frontend — React 19 + TypeScript + Vite]
   │  SearchBar, CurrentWeather, HourlyChart,
   │  WeeklyForecast, UVBar, WeatherIcon, SkeletonLoader
   │  hooks: useWeather, useGeolocation
   │  services: weatherApi.ts
   │
   │  GET /api/weather?city=<cidade>
   │  GET /api/weather?lat=<lat>&lon=<lon>
   ▼
[Backend — Express 5 + TypeScript]
   │  routes/weather.ts
   │  services/geocodingService.ts
   │  services/openMeteoService.ts
   │  middleware/errorHandler.ts
   │
   │  GET https://geocoding-api.open-meteo.com/v1/search
   │  GET https://api.open-meteo.com/v1/forecast
   ▼
[Open-Meteo API — pública, sem autenticação]
```

**Fluxo de dados — busca por cidade:**
1. Usuário digita cidade → frontend chama `GET /api/weather?city=Curitiba`
2. Backend chama Geocoding API → obtém `latitude` e `longitude`
3. Backend chama Weather API com as coordenadas
4. Backend retorna payload unificado ao frontend
5. Frontend renderiza cards, gráfico e ícones

**Fluxo de dados — geolocalização:**
1. Usuário clica no botão → browser solicita permissão e retorna `lat`/`lon`
2. Frontend chama `GET /api/weather?lat=-25.43&lon=-49.27`
3. Backend chama diretamente Weather API (sem Geocoding, pois já tem coordenadas)
4. Backend retorna payload ao frontend

---

## Design de Implementação

### Estrutura de Arquivos

**Frontend:**
```
frontend/src/
  components/
    SearchBar/
      SearchBar.tsx
      SearchBar.styles.ts
    CurrentWeather/
      CurrentWeather.tsx
      CurrentWeather.styles.ts
    HourlyChart/
      HourlyChart.tsx
      HourlyChart.styles.ts
    WeeklyForecast/
      WeeklyForecast.tsx
      WeeklyForecast.styles.ts
    WeatherIcon/
      WeatherIcon.tsx           ← despacha SVG por weatherCode
      icons/                    ← componentes SVG animados
        SunIcon.tsx
        CloudIcon.tsx
        RainIcon.tsx
        StormIcon.tsx
        SnowIcon.tsx
        FogIcon.tsx
    UVBar/
      UVBar.tsx
      UVBar.styles.ts
    SkeletonLoader/
      SkeletonLoader.tsx
      SkeletonLoader.styles.ts
  hooks/
    useWeather.ts               ← fetch + estado (loading, error, data)
    useGeolocation.ts           ← navigator.geolocation wrapper
  services/
    weatherApi.ts               ← função fetchWeather(params)
  types/
    weather.types.ts            ← interfaces TypeScript
  utils/
    weatherUtils.ts             ← mappers: code→condição, temp→gradiente
  App.tsx
  App.styles.ts
```

**Backend:**
```
backend/
  src/
    routes/
      weather.ts                ← GET /api/weather handler
    services/
      geocodingService.ts       ← chama Open-Meteo Geocoding
      openMeteoService.ts       ← chama Open-Meteo Weather API
    types/
      weather.types.ts          ← interfaces TypeScript do domínio
    middleware/
      errorHandler.ts           ← handler global de erros Express
  server.ts                     ← bootstrap Express
  tsconfig.json
```

### Modelos de Dados

**`WeatherData` — payload retornado pelo backend ao frontend:**

```typescript
interface WeatherData {
  city: string;
  current: {
    temperature: number;        // °C
    feelsLike: number;          // °C
    humidity: number;           // %
    windSpeed: number;          // km/h
    uvIndex: number;            // 0–11+
    precipitation: number;      // mm
    weatherCode: number;        // WMO code
  };
  hourly: Array<{
    time: string;               // ISO 8601
    temperature: number;        // °C
    precipitationProbability: number; // %
  }>;                           // próximas 24h
  daily: Array<{
    date: string;               // YYYY-MM-DD
    temperatureMax: number;     // °C
    temperatureMin: number;     // °C
    precipitationSum: number;   // mm
    weatherCode: number;        // WMO code
  }>;                           // 7 dias
}
```

**`WeatherParams` — parâmetros aceitos pelo backend:**

```typescript
type WeatherParams =
  | { city: string }
  | { lat: number; lon: number };
```

**`AppState` — estado global do frontend:**

```typescript
interface AppState {
  data: WeatherData | null;
  loading: boolean;
  error: 'not_found' | 'server_error' | null;
}
```

### Endpoints de API

#### Backend

| Método | Path | Params | Status | Descrição |
|--------|------|--------|--------|-----------|
| `GET` | `/api/weather` | `?city=<cidade>` | 200, 400, 404 | Busca por nome de cidade |
| `GET` | `/api/weather` | `?lat=<lat>&lon=<lon>` | 200, 400, 404 | Busca por coordenadas |
| `GET` | `/status` | — | 200 | Health check (existente) |

**Responses de erro:**

```json
// 400 — parâmetros ausentes
{ "error": "Parâmetro obrigatório: city ou lat+lon" }

// 404 — cidade não encontrada
{ "error": "Cidade não encontrada" }
```

**Response 200 — shape alinhado com `WeatherData`:**
```json
{
  "city": "Curitiba",
  "current": { "temperature": 18, "feelsLike": 16, "humidity": 72, ... },
  "hourly": [ { "time": "2026-04-10T14:00", "temperature": 19, "precipitationProbability": 10 }, ... ],
  "daily": [ { "date": "2026-04-10", "temperatureMax": 21, "temperatureMin": 14, ... }, ... ]
}
```

#### Open-Meteo (consumido pelo backend)

**Geocoding API:**
```
GET https://geocoding-api.open-meteo.com/v1/search
  ?name=<cidade>
  &count=1
  &language=pt
  &format=json

Response: { results: [{ name, latitude, longitude, country }] }
```

**Weather API:**
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=<lat>
  &longitude=<lon>
  &current=temperature_2m,apparent_temperature,relative_humidity_2m,
           precipitation,wind_speed_10m,uv_index,weather_code
  &hourly=temperature_2m,precipitation_probability
  &daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code
  &timezone=auto
  &forecast_days=7
  &wind_speed_unit=kmh
```

### Interfaces Principais

**`useWeather` hook:**

```typescript
function useWeather(): {
  data: WeatherData | null;
  loading: boolean;
  error: 'not_found' | 'server_error' | null;
  search: (params: WeatherParams) => Promise<void>;
}
```

**`useGeolocation` hook:**

```typescript
function useGeolocation(): {
  getPosition: () => Promise<{ lat: number; lon: number }>;
  loading: boolean;
  error: string | null;
}
```

**`weatherUtils.ts`:**

```typescript
// Mapeamento WMO code → condição visual
function getWeatherCondition(code: number): 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog'

// Mapeamento temperatura → gradiente CSS
function getTemperatureGradient(temp: number): string
// < 0°C   → '#1a1a4e, #2d2d8f'   (azul escuro/roxo)
// 0–10°C  → '#1e3a5f, #2196F3'   (azul frio)
// 10–20°C → '#0d47a1, #00bcd4'   (azul/teal)
// 20–28°C → '#1b5e20, #4caf50'   (verde)
// 28–35°C → '#e65100, #ff9800'   (laranja)
// > 35°C  → '#b71c1c, #f44336'   (vermelho)
```

### Mapeamento WMO Weather Codes

| Código(s) | Condição | Ícone |
|-----------|----------|-------|
| 0 | Céu limpo | `SunIcon` |
| 1, 2 | Parcialmente nublado | `CloudIcon` (parcial) |
| 3 | Nublado | `CloudIcon` (cheio) |
| 45, 48 | Névoa/Neblina | `FogIcon` |
| 51–67, 80–82 | Chuva/Garoa | `RainIcon` |
| 71–77, 85, 86 | Neve | `SnowIcon` |
| 95–99 | Trovoada | `StormIcon` |

### Lógica de Ícones SVG Animados (styled-components)

Cada ícone é um componente SVG React estilizado com `styled-components`. As animações são declaradas com `@keyframes` do styled-components:

- **SunIcon:** rotação lenta (`spin 20s linear infinite`) + escala pulsante
- **CloudIcon:** flutuação suave (`float 3s ease-in-out infinite`)
- **RainIcon:** gotas caindo animadas com `translateY`
- **StormIcon:** flash de relâmpago com `opacity` + nuvem com flutuação
- **SnowIcon:** flocos caindo com rotação
- **FogIcon:** ondas horizontais com `translateX`

### Lógica de Background Dinâmico

O background da `App` é um `linear-gradient` determinado pela temperatura atual. A transição entre gradientes é suavizada com `transition: background 1s ease`.

### Barra Visual UV

```
Gradiente: verde (0) → amarelo (3) → laranja (6) → vermelho (11+)
Indicador: posição = (uvIndex / 11) * 100%
Labels: Baixo (0-2), Moderado (3-5), Alto (6-7), Muito Alto (8-10), Extremo (11+)
```

### Cards de 7 Dias — Barra de Temperatura

A barra de temperatura relativa exibe a faixa diária (min→max) em relação ao range total da semana:

```
posição_left  = (dayMin - weekMin) / (weekMax - weekMin) * 100%
largura_barra = (dayMax - dayMin)  / (weekMax - weekMin) * 100%
```

---

## Pontos de Integração

### Open-Meteo Geocoding API
- **URL:** `https://geocoding-api.open-meteo.com/v1/search`
- **Autenticação:** Nenhuma (API pública)
- **Tratamento de erro:** Se `results` for array vazio → retornar 404 ao frontend

### Open-Meteo Weather API
- **URL:** `https://api.open-meteo.com/v1/forecast`
- **Autenticação:** Nenhuma (API pública)
- **Tratamento de erro:** Se status HTTP ≠ 200 → retornar 500 ao frontend com mensagem genérica
- **Limites:** Sem rate limiting documentado para uso não comercial; sem cache necessário neste escopo

---

## Abordagem de Testes

### Validação de Endpoints (conforme especificado no prompt)

Executar `curl` para validar cada endpoint após implementação:

```bash
# Open-Meteo Geocoding
curl "https://geocoding-api.open-meteo.com/v1/search?name=Curitiba&count=1&language=pt&format=json"

# Open-Meteo Weather (com coordenadas de Curitiba)
curl "https://api.open-meteo.com/v1/forecast?latitude=-25.43&longitude=-49.27&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,uv_index,weather_code&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=7&wind_speed_unit=kmh"

# Backend — busca por cidade
curl "http://localhost:3000/api/weather?city=Curitiba"

# Backend — busca por coordenadas (geolocalização)
curl "http://localhost:3000/api/weather?lat=-25.43&lon=-49.27"

# Backend — cidade inválida (deve retornar 404)
curl -v "http://localhost:3000/api/weather?city=CidadeQueNaoExiste123"

# Backend — sem parâmetros (deve retornar 400)
curl -v "http://localhost:3000/api/weather"
```

### Testes Manuais de UI

- Buscar cidade válida → dados exibidos corretamente
- Buscar cidade inexistente → mensagem de erro amigável + botão retry
- Clicar em geolocalização → loading → dados da cidade atual
- Verificar responsividade em mobile (375px) e desktop (1440px)
- Verificar animação do background ao mudar de cidade com temperaturas distintas
- Verificar skeleton loading durante fetch

---

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Migração do backend para TypeScript** — base necessária antes de qualquer nova lógica
   - Instalar `typescript`, `tsx`, `@types/node`, `@types/express`
   - Criar `tsconfig.json` no backend
   - Renomear `server.js` → `server.ts`, criar estrutura de pastas `src/`
   - Atualizar scripts `package.json` (dev: `tsx watch src/server.ts`)

2. **Serviços Open-Meteo no backend** — core da integração externa
   - `geocodingService.ts`: busca lat/lon por nome de cidade
   - `openMeteoService.ts`: busca dados climáticos por lat/lon
   - Testar com `curl` ambas as APIs

3. **Rota `/api/weather` no backend** — expor dados ao frontend
   - `routes/weather.ts`: lógica de validação de parâmetros + orquestração dos serviços
   - `middleware/errorHandler.ts`: respostas padronizadas de erro
   - Testar com `curl` todos os cenários (200, 400, 404)

4. **Types e utilities no frontend** — fundação tipada antes dos componentes
   - `types/weather.types.ts`
   - `utils/weatherUtils.ts` (mappers de WMO code e temperatura→gradiente)

5. **Services e hooks do frontend** — camada de dados
   - `services/weatherApi.ts`
   - `hooks/useWeather.ts`
   - `hooks/useGeolocation.ts`

6. **Componentes de UI** — construção de baixo para cima
   - `WeatherIcon` + SVGs animados (base visual independente)
   - `SkeletonLoader` (reutilizado por todos os cards)
   - `UVBar`
   - `SearchBar` (com botão de geolocalização)
   - `CurrentWeather`
   - `WeeklyForecast`
   - `HourlyChart` (Recharts — mais complexo, deixar para depois)

7. **App.tsx + App.styles.ts** — integração de todos os componentes
   - Background dinâmico por temperatura
   - Orquestração de estado (loading, error, data)

8. **Validação final** — `curl` de todos os endpoints + smoke test visual

### Dependências Técnicas

**Frontend — novas dependências a instalar:**
```
styled-components
@types/styled-components
recharts
@types/recharts
```

**Backend — novas dependências a instalar:**
```
typescript
tsx
@types/node
@types/express
@types/cors
```

---

## Monitoramento e Observabilidade

Escopo local — sem infraestrutura de monitoramento. O endpoint `/status` existente serve como health check básico. Logs de console no backend registram erros de integração com Open-Meteo para debugging em desenvolvimento.

---

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Gráfico | Recharts | API declarativa nativa React, boa integração com TypeScript e styled-components |
| Estilização | styled-components | Obrigatório conforme skills definidas no projeto; permite CSS dinâmico baseado em props (temperatura, condição) |
| Ícones animados | SVG + CSS | Zero dependência extra; controle total de design; animações leves e customizáveis |
| Backend TypeScript | Sim | Consistência com frontend; type safety nas chamadas à API Open-Meteo |
| Geolocalização | Mesmo endpoint (`/api/weather`) com `lat`/`lon` | Simplicidade; evita duplicação de lógica de chamada à Weather API |
| State management | Hooks customizados (sem Redux/Zustand) | Escopo simples; estado limitado a uma única busca ativa |

### Riscos Conhecidos

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| Cidade com nome ambíguo (ex: "São Paulo" existe em vários países) | Média | Geocoding API retorna o primeiro resultado; não há seletor de país no escopo atual |
| Permissão de geolocalização negada pelo usuário | Alta | Exibir mensagem explicativa e manter campo de busca como fallback |
| Open-Meteo fora do ar | Baixa | Backend retorna 500 com mensagem genérica; frontend exibe tela de erro com retry |
| Cidades com nomes não-ASCII (ex: acentos) | Média | `encodeURIComponent` no backend ao montar a URL da Geocoding API |
| Recharts não renderizar corretamente em mobile | Baixa | Usar `ResponsiveContainer` do Recharts para adaptar ao tamanho do viewport |

### Conformidade com Skills Padrão

Skills disponíveis no projeto aplicáveis a esta Tech Spec:

| Skill | Aplicação |
|-------|-----------|
| `frontend/.agents/skills/vercel-react-best-practices` | Hooks patterns, async handling, bundle optimization |
| `frontend/.agents/skills/vercel-composition-patterns` | Compound components, avoid boolean props, explicit variants |
| `frontend/.agents/skills/ui-ux-pro-max` | Cores dinâmicas, responsividade, animações, gráficos |
| `frontend/.agents/skills/react` | useEffect patterns, component patterns |
| `frontend/.agents/skills/typescript-advanced` | Type safety, generics nas interfaces de API |
| `backend/.agents/skills/hono` | *(não aplicável — mantendo Express)* |

### Arquivos Relevantes e Dependentes

**Arquivos existentes que serão modificados:**

| Arquivo | Tipo de mudança |
|---------|----------------|
| `backend/server.js` → `backend/src/server.ts` | Migração para TypeScript + reestruturação |
| `backend/package.json` | Adição de dependências TS + atualização de scripts |
| `frontend/src/App.tsx` | Reescrita completa com integração de todos os componentes |
| `frontend/package.json` | Adição de styled-components e recharts |

**Arquivos novos a criar:**

| Arquivo | Responsabilidade |
|---------|-----------------|
| `backend/tsconfig.json` | Config TypeScript do backend |
| `backend/src/routes/weather.ts` | Handler da rota `/api/weather` |
| `backend/src/services/geocodingService.ts` | Integração com Open-Meteo Geocoding |
| `backend/src/services/openMeteoService.ts` | Integração com Open-Meteo Weather API |
| `backend/src/types/weather.types.ts` | Interfaces TypeScript do domínio |
| `backend/src/middleware/errorHandler.ts` | Handler global de erros Express |
| `frontend/src/types/weather.types.ts` | Interfaces TypeScript compartilhadas |
| `frontend/src/utils/weatherUtils.ts` | Mappers WMO code → condição, temp → gradiente |
| `frontend/src/services/weatherApi.ts` | Função `fetchWeather` (HTTP client) |
| `frontend/src/hooks/useWeather.ts` | Estado e lógica de busca de clima |
| `frontend/src/hooks/useGeolocation.ts` | Wrapper do navigator.geolocation |
| `frontend/src/App.styles.ts` | Estilos globais e background dinâmico |
| `frontend/src/components/SearchBar/*` | Componente de busca + geolocalização |
| `frontend/src/components/CurrentWeather/*` | Cards de clima atual |
| `frontend/src/components/HourlyChart/*` | Gráfico Recharts hora a hora |
| `frontend/src/components/WeeklyForecast/*` | Cards dos 7 dias |
| `frontend/src/components/WeatherIcon/*` | Dispatcher de ícones SVG animados |
| `frontend/src/components/UVBar/*` | Barra visual do índice UV |
| `frontend/src/components/SkeletonLoader/*` | Placeholders de loading |

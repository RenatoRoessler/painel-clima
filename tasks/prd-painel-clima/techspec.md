# Tech Spec — Painel de Clima

## Resumo Executivo

A implementação adiciona um painel climático completo sobre a infraestrutura existente (Express + React 19). O backend é migrado de JavaScript para TypeScript e ganha um módulo `weatherService` responsável por geocoding e consulta à Open-Meteo, expondo `GET /api/weather`. O frontend substitui o `App.tsx` de status por uma interface completa com estado local via `useState`, consumindo o backend via proxy Vite, e usando `styled-components` para estilização e `Recharts` para o gráfico hora a hora. O background da página responde dinamicamente à temperatura atual com gradientes CSS.

---

## Arquitetura do Sistema

### Visão Geral dos Componentes

**Backend (Express 5 → TypeScript)**
| Arquivo | Responsabilidade |
|---|---|
| `server.ts` | Bootstrap Express, CORS, registro de rotas |
| `routes/weather.ts` | Handler `GET /api/weather?city=` — validação, orquestração |
| `services/weatherService.ts` | Geocoding + busca de dados na Open-Meteo |
| `types/weather.ts` | Interfaces TypeScript dos payloads |

**Frontend (React 19 + TypeScript)**
| Componente | Responsabilidade |
|---|---|
| `App.tsx` | Orquestrador de estado (dados, loading, erro) + background dinâmico |
| `SearchBar` | Input de cidade + botão de geolocalização |
| `CurrentWeather` | Cards de clima atual (temp, umidade, vento, UV, precipitação) |
| `UVBar` | Barra gradiente de índice UV |
| `WeatherIcon` | Ícone animado por condição climática |
| `HourlyChart` | Gráfico Recharts para previsão hora a hora |
| `DailyForecast` | 7 cards com barras visuais de temp mín/máx |
| `SkeletonLoader` | Placeholders animados durante carregamento |
| `ErrorMessage` | Feedback de erro com botão retry |
| `api/weatherClient.ts` | Módulo isolado de fetch para `GET /api/weather` |
| `utils/gradientUtils.ts` | Cálculo do gradiente CSS baseado em temperatura |

**Fluxo de dados:**
```
Usuário (cidade/geolocalização)
  → SearchBar
    → App.tsx (fetch via weatherClient)
      → Vite proxy → GET /api/weather
        → routes/weather.ts
          → weatherService (Geocoding API → Forecast API)
        → JSON response
      → App.tsx state update
        → CurrentWeather | HourlyChart | DailyForecast
```

---

## Design de Implementação

### Interfaces Principais

**Backend — `types/weather.ts`**
```typescript
export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface WeatherCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  uv_index: number;
  precipitation: number;
  weather_code: number;
}

export interface WeatherResponse {
  current: WeatherCurrent;
  current_units: Record<string, string>;
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
  };
  city: string;
}
```

**Frontend — `api/weatherClient.ts`**
```typescript
export async function fetchWeather(city: string): Promise<WeatherResponse>
```

### Modelos de Dados

**Parâmetros da Open-Meteo Forecast API:**
- `current`: `temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,precipitation,weather_code`
- `hourly`: `temperature_2m,precipitation_probability` (próximas 24h)
- `daily`: `temperature_2m_max,temperature_2m_min,precipitation_sum` (7 dias)
- `timezone`: `auto`
- `forecast_days`: `7`

**Gradiente de background por temperatura (`gradientUtils.ts`):**

| Faixa | Gradiente |
|---|---|
| < 0°C | `#1a1a2e → #16213e` (azul noturno) |
| 0–10°C | `#2d6a4f → #1e3a5f` (verde-azul frio) |
| 10–20°C | `#52b69a → #168aad` (verde-turquesa) |
| 20–28°C | `#f77f00 → #d62828` (laranja-quente) |
| > 28°C | `#d62828 → #6a0572` (vermelho-intenso) |

### Endpoints de API

**Backend:**
```
GET /api/weather?city=<string>

200 OK      → WeatherResponse (JSON)
400 Bad Request  → { error: "Parâmetro 'city' é obrigatório" }
404 Not Found    → { error: "Cidade não encontrada" }
500 Internal     → { error: "Erro interno ao consultar dados" }
```

**Configuração do proxy Vite (`vite.config.ts`):**
```typescript
server: {
  proxy: {
    '/api': { target: 'http://localhost:3000', changeOrigin: true }
  }
}
```

---

## Pontos de Integração

**Open-Meteo Geocoding API:**
- URL: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1`
- Sem autenticação. Retorna array `results`; se vazio → 404.

**Open-Meteo Forecast API:**
- URL: `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&...`
- Sem autenticação. Chamada feita apenas pelo backend.

**Geolocalização (Browser):**
- `navigator.geolocation.getCurrentPosition()` no frontend.
- Coordenadas enviadas como `city=lat,lon` ou nova query param `?lat=&lon=` — backend detecta o formato e chama Forecast API diretamente (sem geocoding).

---

## Abordagem de Testes

### Testes Unidade

- `weatherService`: mock de `fetch` global; testar geocoding retornando cidade válida, cidade inexistente (array vazio), e erro de rede.
- `gradientUtils`: testar cada faixa de temperatura retornando o gradiente correto.
- `routes/weather.ts`: testar resposta 400 sem parâmetro `city`, 404 para cidade inexistente, 200 com mock do service.

### Testes de Integração

- `GET /api/weather?city=São Paulo` com servidor real e Open-Meteo ao vivo — validar shape do JSON retornado.
- `GET /api/weather` sem parâmetros — validar HTTP 400.
- `GET /api/weather?city=CidadeQueNaoExiste123` — validar HTTP 404.
- Validação via `curl` conforme especificado na task.

### Testes de E2E

Playwright:
- Buscar cidade "Rio de Janeiro" → aguardar cards renderizados → validar temperatura visível.
- Clicar em retry após simular falha de rede (`page.route` mock).
- Verificar skeleton presente durante loading (intercept de API com delay).
- Verificar que background muda conforme temperatura (checar CSS `background` do body).

---

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Backend TS migration** — adicionar `tsx`/`ts-node`, converter `server.js` → `server.ts`, criar estrutura de pastas `routes/` e `services/`.
2. **`weatherService.ts`** — implementar geocoding + forecast (validar com curl antes de prosseguir).
3. **`routes/weather.ts`** — handler com tratamento de erros 400/404/500.
4. **Frontend `types/` + `api/weatherClient.ts`** — tipagem compartilhada e módulo de fetch.
5. **`SearchBar` + geolocalização** — input, submit, botão geo, loading state.
6. **`CurrentWeather` + `UVBar` + `WeatherIcon`** — cards de clima atual com styled-components.
7. **`HourlyChart`** — `AreaChart` do Recharts com temp + precipitação.
8. **`DailyForecast`** — 7 cards com barras visuais mín/máx.
9. **`SkeletonLoader` + `ErrorMessage`** — estados de loading e erro com retry.
10. **Background dinâmico** — `gradientUtils.ts` integrado no `App.tsx`.

### Dependências Técnicas

**Novas dependências a instalar:**

Frontend:
```bash
npm install styled-components recharts
npm install -D @types/styled-components
```

Backend:
```bash
npm install tsx
npm install -D typescript @types/node @types/express
```

---

## Monitoramento e Observabilidade

- Backend loga no console: cidade buscada, tempo de resposta da Open-Meteo, e erros com stack trace.
- Formato: `[WEATHER] city="São Paulo" geocoding=42ms forecast=318ms total=361ms`
- Erros 5xx logados com nível `ERROR` incluindo mensagem da exceção.
- Frontend exibe estado de erro ao usuário; não silencia exceções.

---

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Justificativa |
|---|---|---|
| Gráfico | Recharts | API declarativa React-native, SVG, suficiente para 24 pontos de dados |
| Estilização | styled-components v6 | Obrigatório na task; suporte React 19 confirmado |
| Backend lang | TypeScript com `tsx` | Tipagem segura para payloads da Open-Meteo; `tsx` evita build step em dev |
| Dev proxy | Vite proxy | Elimina CORS entre :5173 e :3000 sem expor backend |
| Estado | useState + fetch | App single-page sem estado global; TanStack Query seria over-engineering |
| Geocoding | Open-Meteo (mesmo provider) | Zero dependências extras; já planejado na task |

### Riscos Conhecidos

- **Rate limiting Open-Meteo:** API gratuita com limite generoso mas sem SLA. Sem cache, buscas repetidas podem atingir limite em uso intenso. Mitigação: adicionar debounce de 500ms no submit do campo de busca.
- **Geolocalização negada pelo browser:** tratar `PermissionDeniedError` exibindo mensagem amigável e mantendo campo de busca ativo.
- **`weather_code` da Open-Meteo:** mapeamento de código WMO para ícone/animação deve ser implementado como lookup table — evitar lógica condicional complexa.

### Conformidade com Skills Padrões

| Skill | Aplicação neste spec |
|---|---|
| `vercel-react-best-practices` | Chamadas assíncronas paralelas (`hourly` + `daily`), early exit em erros, index maps para lookup de weather codes |
| `vercel-composition-patterns` | Componentes compostos sem boolean props (ex: `<WeatherIcon code={213} />` não `<WeatherIcon isSunny />`) |
| `ui-ux-pro-max` | Skeleton loading, cores dinâmicas, gráfico interativo, responsividade mobile-first |
| `typescript-advanced` | Tipos estritos para payloads da Open-Meteo; sem `any` |
| `styled-components` | Todo CSS via styled-components; sem CSS files, sem inline styles |
| `react` (SKILL.md) | `useEffect` patterns para fetch; sem side effects em render |

### Arquivos relevantes e dependentes

```
backend/
  server.js             → migrar para server.ts
  routes/weather.ts     → novo
  services/weatherService.ts → novo
  types/weather.ts      → novo
  tsconfig.json         → novo
  package.json          → atualizar scripts e deps

frontend/
  src/App.tsx           → reescrever completo
  src/main.tsx          → sem alteração
  src/api/weatherClient.ts    → novo
  src/types/weather.ts        → novo
  src/utils/gradientUtils.ts  → novo
  src/components/SearchBar.tsx        → novo
  src/components/CurrentWeather.tsx   → novo
  src/components/UVBar.tsx            → novo
  src/components/WeatherIcon.tsx      → novo
  src/components/HourlyChart.tsx      → novo
  src/components/DailyForecast.tsx    → novo
  src/components/SkeletonLoader.tsx   → novo
  src/components/ErrorMessage.tsx     → novo
  vite.config.ts        → adicionar proxy
  package.json          → adicionar styled-components, recharts
```

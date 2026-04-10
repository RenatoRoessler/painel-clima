# Tarefa 1.0: Backend — Migração TS + Weather API

<critical>Ler os arquivos de prd.md e techspec.md desta pasta antes de iniciar. Sua tarefa será invalidada se não os ler.</critical>

## Visão Geral

Migrar o backend de JavaScript para TypeScript e implementar toda a lógica de dados climáticos: geocoding, consulta à Open-Meteo e rota `GET /api/weather`. Ao final desta tarefa, o backend deve estar completamente funcional e validado via `curl`.

<skills>
### Conformidade com Skills Padrões

- `hono` (`.agents/skills/hono`) — avaliar como referência de estrutura de rotas, mas manter Express 5 conforme Tech Spec
- `vercel-react-best-practices` (frontend/.agents/skills) — padrões de async/await paralelo aplicáveis ao weatherService
</skills>

<requirements>
- Migrar `server.js` → `server.ts` usando `tsx` como runtime em desenvolvimento
- Criar `tsconfig.json` para o backend
- Criar `types/weather.ts` com interfaces `GeocodingResult`, `WeatherCurrent` e `WeatherResponse`
- Criar `services/weatherService.ts` com geocoding (Open-Meteo Geocoding API) e forecast (Open-Meteo Forecast API)
- Criar `routes/weather.ts` com handler `GET /api/weather?city=`
- Registrar a rota no `server.ts`
- Parâmetros de forecast: `current`, `hourly` (temperature_2m, precipitation_probability), `daily` (temperature_2m_max, temperature_2m_min, precipitation_sum), `timezone=auto`, `forecast_days=7`
- Resposta deve incluir o campo `city` com o nome da cidade
- Status codes: 200 (sucesso), 400 (sem parâmetro city), 404 (cidade não encontrada), 500 (erro interno)
- CORS deve continuar habilitado
- Logs no console: `[WEATHER] city="..." geocoding=Xms forecast=Xms total=Xms`
</requirements>

## Subtarefas

- [ ] 1.1 Instalar dependências: `tsx`, `typescript`, `@types/node`, `@types/express`
- [ ] 1.2 Criar `tsconfig.json` para o backend
- [ ] 1.3 Criar `types/weather.ts` com todas as interfaces
- [ ] 1.4 Criar `services/weatherService.ts` — implementar `getWeatherByCity(city: string)`
- [ ] 1.5 Criar `routes/weather.ts` — handler com tratamento de todos os status codes
- [ ] 1.6 Migrar `server.js` → `server.ts` e registrar rota `/api/weather`
- [ ] 1.7 Atualizar `package.json`: scripts `dev` e `start` para usar `tsx`
- [ ] 1.8 Testes unitários do `weatherService`
- [ ] 1.9 Validação de integração via `curl`

## Detalhes de Implementação

Consultar `techspec.md` — seções:
- **Interfaces Principais** (tipos exatos de `WeatherResponse`, `WeatherCurrent`, `GeocodingResult`)
- **Endpoints de API** (parâmetros Open-Meteo, status codes)
- **Pontos de Integração** (URLs das APIs, tratamento de `results` vazio no geocoding)
- **Monitoramento** (formato do log)

## Critérios de Sucesso

- `npm run dev` inicia sem erros de TypeScript
- `curl "http://localhost:3000/api/weather?city=São Paulo"` retorna JSON com `current`, `hourly`, `daily` e `city`
- `curl "http://localhost:3000/api/weather"` retorna HTTP 400
- `curl "http://localhost:3000/api/weather?city=CidadeInexistente999"` retorna HTTP 404
- Todos os testes unitários passam

## Testes da Tarefa

- [ ] **Unitários** — `weatherService`: mock de `fetch` global testando cidade válida (geocoding + forecast), cidade inexistente (array `results` vazio → lança erro 404), e erro de rede
- [ ] **Unitários** — `routes/weather.ts`: mock do service, testar 400 (sem param), 404 (city not found), 200 (sucesso com payload correto), 500 (exceção inesperada)
- [ ] **Integração** — `curl` para cada um dos 4 status codes com servidor rodando real

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

```
backend/
  server.js             → migrar para server.ts
  routes/weather.ts     → novo
  services/weatherService.ts → novo
  types/weather.ts      → novo
  tsconfig.json         → novo
  package.json          → atualizar scripts e deps
```

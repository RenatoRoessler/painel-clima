# Tarefa 1.0: Backend — Migração TS + Serviços Open-Meteo + Rota `/api/weather`

<critical>Ler os arquivos de prd.md e techspec.md desta pasta antes de iniciar. Sua tarefa será invalidada se não o fizer.</critical>

## Visão Geral

Migrar o backend de JavaScript para TypeScript, reestruturar em camadas (rotas, serviços, middleware) e implementar a integração completa com a API Open-Meteo. Ao final desta tarefa o backend deve expor o endpoint `GET /api/weather` funcional, validado via curl, retornando o payload `WeatherData` completo.

<skills>
### Conformidade com Skills Padrão

Verificar e aplicar as seguintes skills disponíveis em `backend/.agents/skills/`:

- `hono` — padrões de rotas e handlers (adaptar para Express)
- `elysia` — patterns de validação de parâmetros (adaptar para Express)
- `workflow` — organização de camadas de serviço
</skills>

<requirements>

### Requisitos Obrigatórios

- O backend deve ser executado com `npm run dev` sem erros após a migração para TypeScript
- O endpoint `GET /api/weather?city=<cidade>` deve retornar 200 com payload `WeatherData` completo
- O endpoint `GET /api/weather?lat=<lat>&lon=<lon>` deve retornar 200 com payload `WeatherData` completo
- O endpoint deve retornar 400 quando nenhum parâmetro válido for enviado
- O endpoint deve retornar 404 quando a cidade não for encontrada na Geocoding API
- O endpoint `/status` existente deve continuar funcionando
- Nenhuma chamada à Open-Meteo deve ser feita diretamente pelo frontend (backend como único intermediário)
- O payload de resposta deve seguir exatamente a interface `WeatherData` definida na techspec.md

</requirements>

## Subtarefas

- [ ] 1.1 Instalar dependências TypeScript (`typescript`, `tsx`, `@types/node`, `@types/express`, `@types/cors`)
- [ ] 1.2 Criar `backend/tsconfig.json` com configuração adequada para Node.js
- [ ] 1.3 Criar estrutura de pastas `backend/src/` com subpastas `routes/`, `services/`, `types/`, `middleware/`
- [ ] 1.4 Migrar `server.js` → `backend/src/server.ts` e atualizar scripts em `package.json` (`dev: tsx watch src/server.ts`, `start: tsx src/server.ts`)
- [ ] 1.5 Criar `backend/src/types/weather.types.ts` com interfaces `WeatherData`, `WeatherParams` e tipos de resposta Open-Meteo
- [ ] 1.6 Implementar `backend/src/services/geocodingService.ts` — chama `https://geocoding-api.open-meteo.com/v1/search` e retorna `{ name, latitude, longitude }`
- [ ] 1.7 Implementar `backend/src/services/openMeteoService.ts` — chama `https://api.open-meteo.com/v1/forecast` com os parâmetros definidos na techspec e retorna dados mapeados para `WeatherData`
- [ ] 1.8 Implementar `backend/src/routes/weather.ts` — valida parâmetros (`city` OU `lat`+`lon`), orquestra os serviços, retorna `WeatherData` ou erros padronizados
- [ ] 1.9 Implementar `backend/src/middleware/errorHandler.ts` — handler global de erros Express com respostas JSON padronizadas
- [ ] 1.10 Registrar a rota `/api/weather` e o middleware de erro em `server.ts`
- [ ] 1.11 Executar validação via curl (ver seção Testes)

## Detalhes de Implementação

Consultar `techspec.md` — seções:

- **Estrutura de Arquivos → Backend** para a organização de pastas
- **Modelos de Dados** para as interfaces `WeatherData` e `WeatherParams`
- **Endpoints de API → Backend** para os contratos de request/response
- **Endpoints de API → Open-Meteo** para os parâmetros exatos das chamadas externas
- **Sequenciamento de Desenvolvimento → Dependências Técnicas** para as versões de pacotes
- **Pontos de Integração** para tratamento de erros das APIs externas

## Critérios de Sucesso

- `npm run dev` no backend sobe sem erros de TypeScript
- Todos os curls de validação retornam os status codes esperados
- Payload de `GET /api/weather?city=Curitiba` contém `current`, `hourly` (≥24 itens) e `daily` (7 itens)
- Cidade inexistente retorna `404` com JSON `{ "error": "Cidade não encontrada" }`
- Requisição sem parâmetros retorna `400` com JSON `{ "error": "..." }`

## Testes da Tarefa

```bash
# 1. Geocoding API — deve retornar results com latitude/longitude
curl "https://geocoding-api.open-meteo.com/v1/search?name=Curitiba&count=1&language=pt&format=json"

# 2. Weather API — deve retornar current, hourly, daily
curl "https://api.open-meteo.com/v1/forecast?latitude=-25.43&longitude=-49.27&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,uv_index,weather_code&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=7&wind_speed_unit=kmh"

# 3. Backend por cidade — deve retornar 200 com WeatherData
curl "http://localhost:3000/api/weather?city=Curitiba"

# 4. Backend por coordenadas — deve retornar 200 com WeatherData
curl "http://localhost:3000/api/weather?lat=-25.43&lon=-49.27"

# 5. Cidade inexistente — deve retornar 404
curl -v "http://localhost:3000/api/weather?city=CidadeQueNaoExisteXYZ123"

# 6. Sem parâmetros — deve retornar 400
curl -v "http://localhost:3000/api/weather"

# 7. Health check — deve continuar funcionando
curl "http://localhost:3000/status"
```

<critical>SEMPRE EXECUTE OS CURLS DE VALIDAÇÃO ANTES DE CONSIDERAR A TAREFA FINALIZADA</critical>

## Arquivos Relevantes

**Modificados:**
- `backend/server.js` → `backend/src/server.ts`
- `backend/package.json`

**Criados:**
- `backend/tsconfig.json`
- `backend/src/types/weather.types.ts`
- `backend/src/services/geocodingService.ts`
- `backend/src/services/openMeteoService.ts`
- `backend/src/routes/weather.ts`
- `backend/src/middleware/errorHandler.ts`

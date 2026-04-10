# Tarefa 2.0: Frontend — Painel Completo

<critical>Ler os arquivos de prd.md e techspec.md desta pasta antes de iniciar. Sua tarefa será invalidada se não os ler.</critical>

## Visão Geral

Implementar toda a interface do Painel de Clima sobre o React 19 + Vite existente. Inclui setup de dependências, proxy de desenvolvimento, módulo de API, todos os componentes visuais e integração completa com o backend (tarefa 1.0 deve estar concluída).

<skills>
### Conformidade com Skills Padrões

- `styled-components` (frontend/.agents/skills) — todo CSS via styled-components, sem arquivos CSS ou inline styles
- `vercel-react-best-practices` (frontend/.agents/skills) — useEffect patterns, early exit, index maps para weather_code lookup
- `vercel-composition-patterns` (frontend/.agents/skills) — compound components, sem boolean props (ex: `<WeatherIcon code={213} />` não `<WeatherIcon isSunny />`)
- `ui-ux-pro-max` (frontend/.agents/skills) — skeleton loading, cores dinâmicas, gráfico interativo, mobile-first
- `typescript-advanced` (frontend/.agents/skills) — tipos estritos, sem `any`
- `react` (frontend/.agents/skills) — useEffect patterns para fetch
</skills>

<requirements>
- Instalar `styled-components`, `recharts` e `@types/styled-components`
- Configurar proxy Vite: `/api` → `http://localhost:3000`
- Criar `src/types/weather.ts` com interfaces espelhando o backend
- Criar `src/api/weatherClient.ts` com `fetchWeather(city: string)`
- Criar `src/utils/gradientUtils.ts` com cálculo de gradiente por temperatura
- Implementar todos os componentes com styled-components (sem CSS files)
- Campo de busca SEM autocomplete
- Botão de geolocalização usando `navigator.geolocation.getCurrentPosition()`
- Skeleton loading durante QUALQUER carregamento de dados
- Background da página com gradiente dinâmico baseado na temperatura atual
- Barra UV com gradiente verde → vermelho
- Ícones animados por `weather_code` (lookup table — sem if/else encadeado)
- Gráfico Recharts: `AreaChart` com temperatura e `precipitation_probability` hora a hora, com tooltip interativo
- 7 cards diários com barras visuais de mín/máx proporcionais
- Mensagem amigável + retry quando cidade não encontrada ou erro de rede
- Design responsivo mobile-first
- Interface em PT-BR
- NÃO implementar tema claro/escuro
- NUNCA chamar Open-Meteo diretamente do frontend
</requirements>

## Subtarefas

- [ ] 2.1 Instalar dependências: `styled-components`, `recharts`, `@types/styled-components`
- [ ] 2.2 Configurar proxy no `vite.config.ts`
- [ ] 2.3 Criar `src/types/weather.ts` e `src/api/weatherClient.ts`
- [ ] 2.4 Criar `src/utils/gradientUtils.ts` com as 5 faixas de temperatura
- [ ] 2.5 Criar `SearchBar` — input + botão geolocalização + loading state
- [ ] 2.6 Criar `WeatherIcon` — lookup table de `weather_code` → ícone + animação CSS
- [ ] 2.7 Criar `UVBar` — barra gradiente verde→vermelho com valor do índice UV
- [ ] 2.8 Criar `CurrentWeather` — cards de temperatura, umidade, vento, UV, precipitação
- [ ] 2.9 Criar `HourlyChart` — Recharts `AreaChart` com temp e precipitação hora a hora
- [ ] 2.10 Criar `DailyForecast` — 7 cards com barras proporcionais de mín/máx
- [ ] 2.11 Criar `SkeletonLoader` — placeholders animados para todos os cards
- [ ] 2.12 Criar `ErrorMessage` — mensagem amigável + botão retry
- [ ] 2.13 Reescrever `App.tsx` — orquestrar estado (dados, loading, erro) + background dinâmico
- [ ] 2.14 Testes unitários dos componentes principais
- [ ] 2.15 Verificação de responsividade mobile-first

## Detalhes de Implementação

Consultar `techspec.md` — seções:
- **Visão Geral dos Componentes** (lista completa e responsabilidades)
- **Modelos de Dados** (tabela de gradientes por temperatura, parâmetros Open-Meteo)
- **Interfaces Principais** (`fetchWeather`, `WeatherResponse`)
- **Endpoints de API** (configuração do proxy Vite)
- **Considerações Técnicas** (decisões: Recharts, styled-components, useState, proxy)
- **Riscos Conhecidos** (debounce 500ms no submit, PermissionDeniedError da geolocalização, lookup table para weather_code)

## Critérios de Sucesso

- App carrega sem erros de TypeScript (`npm run build` limpo)
- Busca por "Rio de Janeiro" exibe clima atual, gráfico hora a hora e 7 dias
- Background muda de cor conforme a temperatura retornada
- Skeleton aparece durante o carregamento e desaparece após dados chegarem
- Cidade inválida exibe mensagem amigável com botão retry funcional
- Geolocalização busca clima da posição atual do usuário
- Interface renderiza corretamente em 375px (mobile) e 1280px (desktop)
- Nenhuma chamada direta à Open-Meteo no frontend (verificável no Network tab)

## Testes da Tarefa

- [ ] **Unitários** — `gradientUtils`: testar cada uma das 5 faixas de temperatura retornando gradiente correto
- [ ] **Unitários** — `weatherClient`: mock de `fetch`, testar sucesso (200), cidade não encontrada (404) e erro de rede
- [ ] **Unitários** — `SearchBar`: renderiza input e botão, submit chama callback, loading state desabilita input
- [ ] **Unitários** — `CurrentWeather`: renderiza todos os campos com dados mockados
- [ ] **Unitários** — `DailyForecast`: renderiza exatamente 7 cards com os dados mockados
- [ ] **Unitários** — `ErrorMessage`: renderiza mensagem e botão retry, clique no retry chama callback

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

```
frontend/
  vite.config.ts                          → adicionar proxy
  package.json                            → adicionar deps
  src/App.tsx                             → reescrever completo
  src/main.tsx                            → sem alteração
  src/types/weather.ts                    → novo
  src/api/weatherClient.ts               → novo
  src/utils/gradientUtils.ts             → novo
  src/components/SearchBar.tsx           → novo
  src/components/CurrentWeather.tsx      → novo
  src/components/UVBar.tsx               → novo
  src/components/WeatherIcon.tsx         → novo
  src/components/HourlyChart.tsx         → novo
  src/components/DailyForecast.tsx       → novo
  src/components/SkeletonLoader.tsx      → novo
  src/components/ErrorMessage.tsx        → novo
```

# Tarefa 2.0: Frontend — Fundação + Componentes + Integração

<critical>Ler os arquivos de prd.md e techspec.md desta pasta antes de iniciar. Sua tarefa será invalidada se não o fizer.</critical>
<critical>O backend da Tarefa 1.0 deve estar rodando em http://localhost:3000 antes de iniciar esta tarefa.</critical>

## Visão Geral

Implementar o frontend completo do Painel de Clima: instalação de dependências, tipagem, utilitários, hooks de dados, e todos os componentes visuais. Ao final desta tarefa a aplicação deve estar completamente funcional no browser — busca por cidade, geolocalização, exibição de dados climáticos com visual dinâmico, ícones animados, gráfico hora a hora e previsão de 7 dias.

<skills>
### Conformidade com Skills Padrão

Verificar e aplicar as seguintes skills disponíveis em `frontend/.agents/skills/`:

- `vercel-react-best-practices` — hooks patterns, async handling, bundle optimization
- `vercel-composition-patterns` — compound components, avoid boolean props, explicit variants
- `ui-ux-pro-max` — cores dinâmicas, responsividade, animações, gráficos
- `react` — useEffect patterns, component patterns
- `typescript-advanced` — type safety, generics nas interfaces de API
</skills>

<requirements>

### Requisitos Obrigatórios

- **NÃO** acessar a API Open-Meteo diretamente no frontend — usar exclusivamente `GET /api/weather` do backend
- **NÃO** implementar tema claro/escuro
- **NÃO** adicionar autocomplete no campo de busca
- **NÃO** criar comentários no código
- Toda estilização via `styled-components` (sem CSS puro ou CSS modules)
- Interface inteiramente em Português (BR)
- Design mobile-first e responsivo
- Background com gradiente dinâmico baseado na temperatura atual (6 faixas definidas na techspec)
- Skeleton loading em todos os cards durante fetch
- Feedback visual de erro com opção de retry
- Ícones SVG animados via CSS (sem Lottie ou bibliotecas externas de ícones)
- Gráfico hora a hora com `Recharts` usando `ResponsiveContainer`
- Barra UV com gradiente (verde → amarelo → laranja → vermelho)
- Cards de 7 dias com barra de temperatura relativa mín/máx

</requirements>

## Subtarefas

### Fundação
- [ ] 2.1 Instalar `styled-components`, `@types/styled-components`, `recharts`, `@types/recharts`
- [ ] 2.2 Criar `frontend/src/types/weather.types.ts` — interfaces `WeatherData`, `WeatherParams`, `AppState`
- [ ] 2.3 Criar `frontend/src/utils/weatherUtils.ts` — `getWeatherCondition(code)` e `getTemperatureGradient(temp)`

### Camada de dados
- [ ] 2.4 Criar `frontend/src/services/weatherApi.ts` — função `fetchWeather(params: WeatherParams): Promise<WeatherData>`
- [ ] 2.5 Criar `frontend/src/hooks/useWeather.ts` — estado `{ data, loading, error }` + função `search(params)`
- [ ] 2.6 Criar `frontend/src/hooks/useGeolocation.ts` — wrapper de `navigator.geolocation.getCurrentPosition`

### Componentes base
- [ ] 2.7 Criar `frontend/src/components/WeatherIcon/` — 6 ícones SVG animados (`SunIcon`, `CloudIcon`, `RainIcon`, `StormIcon`, `SnowIcon`, `FogIcon`) + dispatcher por WMO code
- [ ] 2.8 Criar `frontend/src/components/SkeletonLoader/` — placeholders animados reutilizáveis (card, linha, círculo)

### Componentes de UI
- [ ] 2.9 Criar `frontend/src/components/SearchBar/` — input de cidade (sem autocomplete) + botão de busca + botão de geolocalização + loading state
- [ ] 2.10 Criar `frontend/src/components/UVBar/` — barra com gradiente verde→vermelho, indicador de posição e labels PT-BR
- [ ] 2.11 Criar `frontend/src/components/CurrentWeather/` — cards de temperatura, sensação, umidade, vento, precipitação e UV
- [ ] 2.12 Criar `frontend/src/components/WeeklyForecast/` — 7 cards com ícone, data, temp mín/máx e barra relativa de temperatura
- [ ] 2.13 Criar `frontend/src/components/HourlyChart/` — gráfico Recharts com `LineChart` (temperatura) + `Bar` (precipitação) dentro de `ResponsiveContainer`

### Integração
- [ ] 2.14 Reescrever `frontend/src/App.tsx` — orquestração de todos os componentes, background dinâmico por temperatura, estados de loading/error/data
- [ ] 2.15 Criar `frontend/src/App.styles.ts` — estilos globais, transição suave do background (`transition: background 1s ease`)

## Detalhes de Implementação

Consultar `techspec.md` — seções:

- **Estrutura de Arquivos → Frontend** para organização de pastas e nomes de arquivo
- **Modelos de Dados** para interfaces TypeScript
- **Interfaces Principais** para assinaturas de `useWeather` e `useGeolocation`
- **Mapeamento WMO Weather Codes** para tabela de código → condição → ícone
- **Lógica de Ícones SVG Animados** para tipos de animação por condição
- **Lógica de Background Dinâmico** para as 6 faixas de temperatura e gradientes
- **Barra Visual UV** para gradiente e labels
- **Cards de 7 Dias — Barra de Temperatura** para fórmula de posição e largura relativa

## Critérios de Sucesso

- `npm run dev` no frontend sobe sem erros de TypeScript/ESLint
- Busca por "Curitiba" exibe clima atual, gráfico e 7 dias sem erros no console
- Background muda de gradiente ao buscar cidades com temperaturas distintas (ex: cidade quente vs. cidade fria)
- Botão de geolocalização obtém localização e exibe o clima corretamente
- Cidade inexistente exibe mensagem amigável em PT-BR com botão de retry
- Skeleton loading é visível durante o fetch (testar com throttling no DevTools)
- Layout responsivo — sem overflow em 375px e bem distribuído em 1440px
- Ícones animados visíveis e correspondentes à condição climática atual
- Barra UV exibe gradiente e posição correta para diferentes valores
- Gráfico hora a hora é interativo (hover com tooltip) e legível em mobile

## Testes da Tarefa

- [ ] **Busca válida:** digitar "São Paulo" → dados exibidos corretamente (temperatura, umidade, vento, UV, precipitação, gráfico, 7 dias)
- [ ] **Busca inválida:** digitar "XYZ123InvalidCity" → mensagem de erro amigável em PT-BR + botão retry visível
- [ ] **Retry:** clicar em retry → campo de busca disponível para nova tentativa
- [ ] **Geolocalização:** clicar no botão → solicitação de permissão → loading → dados da localização atual
- [ ] **Background dinâmico:** buscar cidade com temperatura < 10°C (ex: Ushuaia) e cidade > 30°C (ex: Manaus) → gradientes distintos e visualmente corretos
- [ ] **Skeleton loading:** simular rede lenta no Chrome DevTools (Slow 3G) → skeletons visíveis antes dos dados
- [ ] **Responsividade mobile:** testar em 375px (iPhone SE) — sem scroll horizontal, elementos legíveis
- [ ] **Responsividade desktop:** testar em 1440px — layout bem distribuído, sem elementos esticados
- [ ] **Ícone UV:** testar valores baixo (1), moderado (4), alto (7), extremo (11) → posição da barra correta
- [ ] **Console limpo:** nenhum erro ou warning no console do browser após busca bem-sucedida

<critical>SEMPRE EXECUTE OS TESTES MANUAIS ACIMA ANTES DE CONSIDERAR A TAREFA FINALIZADA</critical>

## Arquivos Relevantes

**Modificados:**
- `frontend/src/App.tsx`
- `frontend/package.json`

**Criados:**
- `frontend/src/App.styles.ts`
- `frontend/src/types/weather.types.ts`
- `frontend/src/utils/weatherUtils.ts`
- `frontend/src/services/weatherApi.ts`
- `frontend/src/hooks/useWeather.ts`
- `frontend/src/hooks/useGeolocation.ts`
- `frontend/src/components/WeatherIcon/WeatherIcon.tsx`
- `frontend/src/components/WeatherIcon/icons/SunIcon.tsx`
- `frontend/src/components/WeatherIcon/icons/CloudIcon.tsx`
- `frontend/src/components/WeatherIcon/icons/RainIcon.tsx`
- `frontend/src/components/WeatherIcon/icons/StormIcon.tsx`
- `frontend/src/components/WeatherIcon/icons/SnowIcon.tsx`
- `frontend/src/components/WeatherIcon/icons/FogIcon.tsx`
- `frontend/src/components/SkeletonLoader/SkeletonLoader.tsx`
- `frontend/src/components/SkeletonLoader/SkeletonLoader.styles.ts`
- `frontend/src/components/SearchBar/SearchBar.tsx`
- `frontend/src/components/SearchBar/SearchBar.styles.ts`
- `frontend/src/components/UVBar/UVBar.tsx`
- `frontend/src/components/UVBar/UVBar.styles.ts`
- `frontend/src/components/CurrentWeather/CurrentWeather.tsx`
- `frontend/src/components/CurrentWeather/CurrentWeather.styles.ts`
- `frontend/src/components/WeeklyForecast/WeeklyForecast.tsx`
- `frontend/src/components/WeeklyForecast/WeeklyForecast.styles.ts`
- `frontend/src/components/HourlyChart/HourlyChart.tsx`
- `frontend/src/components/HourlyChart/HourlyChart.styles.ts`

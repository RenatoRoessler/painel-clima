# Review: Task 2.0 - Frontend — Painel Completo

**Revisor**: AI Code Reviewer
**Data**: 2026-04-09
**Arquivo da task**: 2_task.md
**Status**: APROVADO COM OBSERVAÇÕES

---

## Resumo

A tarefa foi implementada com alta qualidade: todos os 13 componentes e módulos de suporte foram criados, TypeScript passa sem erros, 25 testes unitários passam e os critérios de sucesso do PRD foram atendidos. Foram encontrados 3 problemas major (inline style, nomes em português no código, acoplamento frágil por string) e 3 problemas minor (linhas em branco dentro de funções, abreviação, código morto). O código demonstra boas práticas de composição React e uso consistente de styled-components.

---

## Arquivos Revisados

| Arquivo | Status | Problemas |
|---------|--------|-----------|
| `src/types/weather.ts` | ✅ OK | 0 |
| `src/api/weatherClient.ts` | ⚠️ Problemas | 1 minor |
| `src/utils/gradientUtils.ts` | ⚠️ Problemas | 1 minor |
| `src/components/SearchBar.tsx` | ✅ OK | 0 |
| `src/components/WeatherIcon.tsx` | ⚠️ Problemas | 1 minor |
| `src/components/UVBar.tsx` | ⚠️ Problemas | 1 major |
| `src/components/CurrentWeather.tsx` | ✅ OK | 0 |
| `src/components/HourlyChart.tsx` | ⚠️ Problemas | 1 major |
| `src/components/DailyForecast.tsx` | ⚠️ Problemas | 1 minor |
| `src/components/SkeletonLoader.tsx` | ✅ OK | 0 |
| `src/components/ErrorMessage.tsx` | ⚠️ Problemas | 1 major |
| `src/App.tsx` | ✅ OK | 0 |
| `src/test/*.test.ts(x)` (6 arquivos) | ✅ OK | 0 |

---

## Problemas Encontrados

### 🔴 Problemas Críticos

Nenhum problema crítico encontrado.

---

### 🟡 Problemas Major

**[M1] `src/components/UVBar.tsx` linha 28 — Inline style viola o padrão de styled-components**

A tarefa e o skill `styled-components` proíbem inline styles (`style={{}}`). A largura da barra de UV é aplicada via `style={{ width: `${percentage}%` }}` diretamente no JSX. Isso mistura responsabilidades e cria um ponto de estilo fora do sistema de styled-components.

```tsx
// Antes (linha 28):
<Fill style={{ width: `${percentage}%` }} />

// Depois — usar prop transiente no styled-component:
<Fill $percentage={percentage} />

// E no styled-component:
const Fill = styled.div<{ $percentage: number }>`
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(to right, #00b09b, #ffcc00, #ff0000);
  transition: width 0.4s ease;
  width: ${({ $percentage }) => $percentage}%;
`;
```

---

**[M2] `src/components/HourlyChart.tsx` linhas 19–22 — Nomes de propriedades em português**

A interface `ChartDataPoint` usa propriedades em português (`hora`, `Temperatura`, `Precipitação`), violando o padrão "todo código em inglês". Apesar de esses nomes aparecerem no tooltip/legenda do Recharts, nomes de propriedades TypeScript devem ser em inglês.

```tsx
// Antes:
interface ChartDataPoint {
  hora: string;
  Temperatura: number;
  Precipitação: number;
}

// Depois — propriedades em inglês, rótulos de display separados:
interface ChartDataPoint {
  hour: string;
  temperature: number;
  precipitation: number;
}

// E nas áreas do Recharts, usar a prop `name` para o rótulo em PT-BR:
<Area dataKey="temperature" name="Temperatura" ... />
<Area dataKey="precipitation" name="Precipitação" ... />
```

Isso também exige atualizar `buildChartData` para gerar os campos com os nomes em inglês.

---

**[M3] `src/components/ErrorMessage.tsx` linha 9 — Acoplamento frágil por correspondência de string**

A lógica `message.toLowerCase().includes('não encontrada')` acopla o comportamento visual do componente a uma substring específica da mensagem de erro. Se o backend ou o `weatherClient` mudarem o texto do erro, o componente exibirá a UI incorreta silenciosamente.

```tsx
// Antes (frágil):
const isCityNotFound = message.toLowerCase().includes('não encontrada');

// Depois — usar um tipo de erro explícito no weatherClient:
// Em weatherClient.ts:
export class CityNotFoundError extends Error {
  constructor() {
    super('Cidade não encontrada');
    this.name = 'CityNotFoundError';
  }
}

// Em App.tsx — propagar o tipo:
setState({ status: 'error', message, isCityNotFound: err instanceof CityNotFoundError });

// Em ErrorMessage.tsx — receber como prop:
interface ErrorMessageProps {
  message: string;
  isCityNotFound: boolean;
  onRetry: () => void;
}
```

---

### 🟢 Problemas Minor

**[m1] `src/api/weatherClient.ts` linha 9 — Linha em branco dentro de função**

Há uma linha em branco entre os dois blocos `if` de verificação de erro (após a linha 8 e antes da linha 10). O padrão proíbe linhas em branco dentro de funções.

```ts
// Remover a linha em branco entre os dois if:
if (res.status === 404) {
  throw new Error('Cidade não encontrada');
}
if (!res.ok) {
  throw new Error(`Erro ao buscar dados: ${res.status}`);
}
```

---

**[m2] `src/components/WeatherIcon.tsx` linha 82 — Abreviação `anim`**

A variável `anim` é uma abreviação de `animation`, violando o padrão "sem abreviações".

```tsx
// Antes:
const anim = ANIMATION_MAP[$animation];
return anim ? anim : 'none';

// Depois:
const animation = ANIMATION_MAP[$animation];
return animation ?? 'none';
```

---

**[m3] `src/components/DailyForecast.tsx` linha 28 — Linha em branco dentro de callback de map**

Há uma linha em branco entre as declarações de `minBar`/`barWidth` e o `return` dentro do callback do `.map()`, violando o padrão.

```tsx
// Remover a linha em branco (linhas 26-29):
{time.map((dateStr, i) => {
  const minBar = ((temperature_2m_min[i] - globalMin) / range) * 100;
  const barWidth = ((temperature_2m_max[i] - temperature_2m_min[i]) / range) * 100;
  return (
    <DayCard key={dateStr}>
      ...
    </DayCard>
  );
})}
```

---

**[m4] `src/utils/gradientUtils.ts` linha 16 — Fallback `??` é código morto**

O operador `??` na linha 16 nunca é executado: como o último item do array tem `maxTemp: Infinity`, o `find` sempre retorna um resultado. O fallback é dead code.

```ts
// Antes (fallback nunca acionado):
const gradient = config?.gradient ?? TEMPERATURE_GRADIENTS[TEMPERATURE_GRADIENTS.length - 1].gradient;

// Depois — usar non-null assertion ou simplificar:
// O find é garantido a retornar um resultado dado o Infinity no array.
// Simplificar para deixar claro que é invariante:
const config = TEMPERATURE_GRADIENTS.find((entry) => temperature <= entry.maxTemp)!;
return `linear-gradient(135deg, ${config.gradient.from}, ${config.gradient.to})`;
```

---

## ✅ Destaques Positivos

- **TypeScript sem erros**: `tsc --noEmit` passa completamente. 25/25 testes unitários passam.
- **Discriminated union para estado da App** (`idle | loading | success | error`): padrão excelente que elimina estados impossíveis e torna o fluxo de dados previsível.
- **Lookup table em `WeatherIcon`**: implementação textbook do padrão solicitado — zero `if/else` encadeado. Fallback seguro com `DEFAULT_ICON`.
- **`gradientUtils.ts` com array de faixas**: elimina magic numbers, cada faixa é autodocumentada, extensível.
- **`useCallback` em todos os handlers de `App.tsx`**: previne re-renders desnecessários nos componentes filhos.
- **Skeleton loader com animação shimmer**: implementação correta de `background-position` animation — UX fiel ao requisito de "nunca spinners genéricos".
- **Early returns em toda a base de código**: `handleSubmit`, `fetchWeather`, `getUVLabel`, `geocodeCity` — padrão consistente.
- **Separação de responsabilidades limpa**: cada componente tem uma única função, sem lógica de negócio vazando para a UI.
- **Dual-axis `AreaChart`** no `HourlyChart`: temperatura e precipitação em eixos independentes, tooltip interativo, legenda em PT-BR — atende RF-13 e RF-14 completamente.
- **`DailyForecast` com barras proporcionais relativas**: cálculo de `globalMin`/`globalMax`/`range` para normalização correta das barras visuais — solução elegante e matematicamente correta.

---

## Conformidade com Padrões

| Padrão | Status |
|--------|--------|
| Padrões de Código (naming, blank lines) | ⚠️ |
| TypeScript (`tsc --noEmit`) | ✅ |
| styled-components (sem CSS files, sem inline styles) | ⚠️ |
| React (useEffect patterns, composition, no boolean props de variante) | ✅ |
| Testes (25/25 passando, cobertura dos 6 componentes exigidos) | ✅ |
| PRD (todos os RF implementados) | ✅ |

---

## Recomendações

1. **[RECOMENDADO]** `UVBar.tsx`: substituir `style={{ width }}` por prop transiente `$percentage` no `Fill` styled-component — alinha com o padrão de zero inline styles.
2. **[RECOMENDADO]** `HourlyChart.tsx`: renomear propriedades de `ChartDataPoint` para inglês (`hour`, `temperature`, `precipitation`) e usar a prop `name` do Recharts para os rótulos em PT-BR.
3. **[RECOMENDADO]** `ErrorMessage.tsx` / `weatherClient.ts`: introduzir `CityNotFoundError` como classe de erro tipada para eliminar o acoplamento por string.
4. **[SUGESTÃO]** Remover linhas em branco dentro de funções em `weatherClient.ts` (linha 9) e `DailyForecast.tsx` (linha 28).
5. **[SUGESTÃO]** Renomear `anim` → `animation` em `WeatherIcon.tsx`.
6. **[SUGESTÃO]** Simplificar o fallback morto em `gradientUtils.ts` usando non-null assertion.

---

## Veredito

**APROVADO COM OBSERVAÇÕES.** O painel está completamente funcional, TypeScript limpo, e a cobertura de testes é sólida. Os 3 problemas major não quebram funcionalidade, mas representam desvios dos padrões da tarefa (inline style, código em português, acoplamento frágil) que devem ser corrigidos antes de considerar o código production-ready. Nenhum item bloqueia o avanço para a Tarefa 3.0 já concluída.

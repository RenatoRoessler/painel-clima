# Review: Task 1.0 - Backend — Migração TS + Weather API

**Revisor**: AI Code Reviewer
**Data**: 2026-04-09
**Arquivo da task**: 1_task.md
**Status**: APROVADO COM OBSERVAÇÕES

---

## Resumo

A tarefa foi implementada com sucesso: o backend foi migrado de JavaScript para TypeScript, a lógica de geocoding + forecast foi encapsulada em `weatherService`, e a rota `GET /api/weather` foi criada com todos os status codes exigidos. Os 7 testes unitários passam e o servidor funciona corretamente em tempo de execução. Foram identificados um problema crítico no `tsconfig.json` (compilação TypeScript falha no strict mode), um arquivo morto (`server.js`) e algumas violações de nomenclatura e formatação dos padrões de código.

---

## Arquivos Revisados

| Arquivo | Status | Problemas |
|---------|--------|-----------|
| `backend/server.ts` | ✅ OK | 0 |
| `backend/server.js` | ⚠️ Problemas | 1 (arquivo morto) |
| `backend/routes/weather.ts` | ⚠️ Problemas | 1 minor |
| `backend/services/weatherService.ts` | ⚠️ Problemas | 1 major, 1 minor |
| `backend/types/weather.ts` | ✅ OK | 0 |
| `backend/tsconfig.json` | ❌ Crítico | 1 critical |
| `backend/jest.config.js` | ✅ OK | 0 |
| `backend/__tests__/weatherService.test.ts` | ✅ OK | 0 |
| `backend/__tests__/weatherRoute.test.ts` | ✅ OK | 0 |

---

## Problemas Encontrados

### 🔴 Problemas Críticos

**[C1] `backend/tsconfig.json` — `moduleResolution: "node"` deprecado causa falha no `tsc`**

`npx tsc --noEmit` falha com:
```
error TS5107: Option 'moduleResolution=node10' is deprecated and will stop functioning in TypeScript 7.0.
```

O runtime (`tsx`) ignora este erro e o servidor funciona, mas o typecheck estrito falha — o que quebra qualquer pipeline de CI e contradiz o critério de sucesso "inicia sem erros de TypeScript".

**Correção sugerida** — `backend/tsconfig.json`, linha 5:
```json
// Antes:
"moduleResolution": "node",

// Opção A — migrar para resolução moderna:
"moduleResolution": "node16",

// Opção B — suprimir temporariamente enquanto migra:
"moduleResolution": "node",
"ignoreDeprecations": "6.0",
```

---

### 🟡 Problemas Major

**[M1] `backend/services/weatherService.ts` — Variáveis com abreviações proibidas**

Linhas 36–45: `t0`, `t1`, `tGeo`, `tForecast` violam o padrão "sem abreviações".

**Correção sugerida:**
```typescript
// Antes:
const t0 = Date.now();
const geo = await geocodeCity(city);
const tGeo = Date.now() - t0;
const t1 = Date.now();
const forecast = await fetchForecast(geo.latitude, geo.longitude);
const tForecast = Date.now() - t1;
const total = Date.now() - t0;

// Depois:
const startTime = Date.now();
const geo = await geocodeCity(city);
const geocodingMs = Date.now() - startTime;
const forecastStart = Date.now();
const forecast = await fetchForecast(geo.latitude, geo.longitude);
const forecastMs = Date.now() - forecastStart;
const totalMs = Date.now() - startTime;
```

**[M2] `backend/server.js` — Arquivo morto não removido após migração**

O arquivo original `server.js` permanece no repositório após a migração para `server.ts`. Além de gerar confusão sobre o ponto de entrada real, viola o princípio de eliminar dead code.

**Correção:** remover `backend/server.js`.

---

### 🟢 Problemas Minor

**[m1] `backend/services/weatherService.ts` — Linhas em branco dentro de função**

Linhas 36–48: `getWeatherByCity` contém múltiplas linhas em branco separando blocos lógicos. O padrão de código proíbe linhas em branco dentro de métodos/funções.

**Correção:** remover as linhas em branco entre os blocos de timing e mover o log para uma linha contínua:
```typescript
export async function getWeatherByCity(city: string): Promise<WeatherResponse> {
  const startTime = Date.now();
  const geo = await geocodeCity(city);
  const geocodingMs = Date.now() - startTime;
  const forecastStart = Date.now();
  const forecast = await fetchForecast(geo.latitude, geo.longitude);
  const forecastMs = Date.now() - forecastStart;
  const totalMs = Date.now() - startTime;
  console.log(`[WEATHER] city="${city}" geocoding=${geocodingMs}ms forecast=${forecastMs}ms total=${totalMs}ms`);
  return { ...forecast, city: geo.name };
}
```

**[m2] `backend/routes/weather.ts` — Linhas em branco dentro do handler**

Linhas 6–8: há uma linha em branco entre a declaração de `city` e o bloco `if (!city)`, e outra entre o `if` e o `try`. Deve ser removida.

---

## ✅ Destaques Positivos

- **Separação de responsabilidades impecável**: `types/`, `services/`, `routes/` — cada módulo faz exatamente uma coisa.
- **Tratamento de erros completo**: todos os 4 status codes (200, 400, 404, 500) implementados e testados.
- **Padrão de erro com `statusCode`** no `weatherService`: elegante e evita uso de exceções genéricas.
- **Cobertura de testes sólida**: 7 testes unitários cobrindo todos os caminhos do serviço e da rota, incluindo cenários de falha.
- **Formato de log** exatamente conforme o Tech Spec: `[WEATHER] city="..." geocoding=Xms forecast=Xms total=Xms`.
- **Interfaces TypeScript** fielmente espelhando o Tech Spec: `GeocodingResult`, `WeatherCurrent`, `WeatherResponse`.
- **CORS habilitado** corretamente via middleware global.
- **`fetchForecast` com `URLSearchParams`**: código limpo, sem concatenação manual de query strings.

---

## Conformidade com Padrões

| Padrão | Status |
|--------|--------|
| Padrões de Código (naming, blank lines) | ⚠️ |
| TypeScript (`tsc --noEmit`) | ❌ |
| REST/HTTP (status codes, JSON) | ✅ |
| Logging | ✅ |
| Testes (7/7 passando) | ✅ |

---

## Recomendações

1. **[OBRIGATÓRIO]** Corrigir `tsconfig.json`: trocar `"moduleResolution": "node"` por `"moduleResolution": "node16"` (ou adicionar `"ignoreDeprecations": "6.0"` como solução temporária).
2. **[OBRIGATÓRIO]** Remover `backend/server.js` — arquivo morto após a migração.
3. **[RECOMENDADO]** Renomear variáveis de timing em `weatherService.ts`: `t0 → startTime`, `t1 → forecastStart`, `tGeo → geocodingMs`, `tForecast → forecastMs`, `total → totalMs`.
4. **[RECOMENDADO]** Remover linhas em branco dentro das funções `getWeatherByCity` e do handler da rota.

---

## Veredito

**APROVADO COM OBSERVAÇÕES.** O backend está funcional, todos os testes passam e os requisitos do PRD/TechSpec foram atendidos. Os itens 1 e 2 das recomendações devem ser corrigidos antes de um merge em produção: o `tsconfig.json` quebra o typecheck estrito (bloqueador de CI), e `server.js` é um artefato residual que não deve permanecer no repositório. As demais melhorias são de padronização e podem ser endereçadas na próxima iteração.

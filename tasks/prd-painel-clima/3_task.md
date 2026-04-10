# Tarefa 3.0: E2E — Validação Playwright

<critical>Ler os arquivos de prd.md e techspec.md desta pasta antes de iniciar. Sua tarefa será invalidada se não os ler.</critical>

## Visão Geral

Implementar e executar testes de ponta a ponta com Playwright cobrindo os fluxos críticos do Painel de Clima. As tarefas 1.0 e 2.0 devem estar concluídas. O backend e o frontend devem estar rodando durante a execução dos testes.

<skills>
### Conformidade com Skills Padrões

- `executar-qa` (`.agents/skills/executar-qa`) — referências para Playwright e validação de UI
- `vercel-react-best-practices` (frontend/.agents/skills) — padrões de teste de componentes React
</skills>

<requirements>
- Instalar Playwright no projeto (pode ser na raiz ou no frontend)
- Os testes devem rodar com backend e frontend ativos (`baseURL` apontando para o frontend)
- Cobrir os 5 fluxos críticos definidos nas subtarefas
- Usar `page.route()` para simular falha de rede e geolocalização
- Validar presença de skeleton durante carregamento com interceptação de resposta com delay
- Validar que o background do body muda de CSS após receber dados com temperatura
- Todos os testes devem passar de forma determinística (sem flakiness)
- NÃO testar internos de componentes — testar comportamento visível ao usuário
</requirements>

## Subtarefas

- [ ] 3.1 Instalar e configurar Playwright (`npm init playwright` ou `npx playwright install`)
- [ ] 3.2 Configurar `playwright.config.ts` com `baseURL`, timeouts e browser targets (Chromium mínimo)
- [ ] 3.3 **Teste: busca por cidade válida** — digitar "São Paulo", submeter, aguardar cards aparecerem, validar temperatura visível na tela
- [ ] 3.4 **Teste: skeleton durante carregamento** — interceptar `GET /api/weather` com delay de 1s, verificar que elementos de skeleton estão presentes antes da resposta
- [ ] 3.5 **Teste: cidade não encontrada** — buscar "CidadeInexistente999xyz", verificar mensagem de erro amigável visível e botão retry presente
- [ ] 3.6 **Teste: retry após erro** — simular falha de rede com `page.route()` retornando 500, clicar retry, restaurar rota normal, verificar dados carregados
- [ ] 3.7 **Teste: background dinâmico** — após busca bem-sucedida, verificar que o CSS `background` do `body` ou elemento raiz contém um gradiente (não é a cor padrão inicial)
- [ ] 3.8 **Teste: geolocalização** — mockar `navigator.geolocation` via `page.addInitScript`, clicar botão geo, validar dados carregados para as coordenadas mockadas
- [ ] 3.9 Executar toda a suíte e garantir 100% de aprovação

## Detalhes de Implementação

Consultar `techspec.md` — seção:
- **Testes de E2E** (estratégia Playwright, uso de `page.route` para mocks, cenários listados)
- **Riscos Conhecidos** (geolocalização negada — mockar `PermissionDeniedError` como caso adicional)

## Critérios de Sucesso

- `npx playwright test` executa sem falhas
- Todos os 6 fluxos críticos (3.3 a 3.8) passam em Chromium
- Nenhum teste depende de ordem de execução (isolados por `beforeEach` com reset de estado)
- Relatório HTML do Playwright gerado (`playwright-report/`)

## Testes da Tarefa

- [ ] **E2E** — Busca por cidade válida → dados visíveis na tela
- [ ] **E2E** — Skeleton presente durante delay de carregamento
- [ ] **E2E** — Mensagem de erro + botão retry para cidade inexistente
- [ ] **E2E** — Retry funcional após erro de rede simulado
- [ ] **E2E** — Background com gradiente após dados carregados
- [ ] **E2E** — Geolocalização mockada retorna dados climáticos

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

```
(raiz ou frontend/)
  playwright.config.ts          → novo
  tests/
    weather.spec.ts             → novo (todos os fluxos E2E)
  package.json                  → adicionar script "test:e2e"
```

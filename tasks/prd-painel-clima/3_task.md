# Tarefa 3.0: E2E — Testes com Playwright

<critical>Ler os arquivos de prd.md e techspec.md desta pasta antes de iniciar. Sua tarefa será invalidada se não o fizer.</critical>
<critical>As Tarefas 1.0 e 2.0 devem estar concluídas e ambos os servidores (backend :3000 e frontend :5173) devem estar rodando antes de iniciar esta tarefa.</critical>

## Visão Geral

Implementar a suíte de testes E2E com Playwright cobrindo os fluxos críticos da aplicação: busca por cidade, geolocalização, tratamento de erro e responsividade. Os testes devem validar que o sistema funciona de ponta a ponta — do input do usuário até a exibição correta dos dados climáticos na tela.

<skills>
### Conformidade com Skills Padrão

Verificar skills disponíveis em `frontend/.agents/skills/`:

- `vercel-react-best-practices` — padrões de teste e mock de APIs externas
</skills>

<requirements>

### Requisitos Obrigatórios

- Usar **Playwright** como framework de testes E2E
- Os testes devem rodar contra o frontend em `http://localhost:5173` com o backend em `http://localhost:3000`
- Cobrir todos os fluxos críticos definidos no PRD
- Mockar a geolocalização do browser (Playwright suporta via `context.setGeolocation`)
- Os testes devem passar de forma determinística (sem flakiness por timing — usar `waitFor` adequadamente)
- Testar em viewport mobile (375x812) e desktop (1440x900)

</requirements>

## Subtarefas

### Setup
- [ ] 3.1 Instalar Playwright (`npm init playwright@latest` ou `npx playwright install`) na raiz ou em `frontend/`
- [ ] 3.2 Configurar `playwright.config.ts` — baseURL `http://localhost:5173`, timeouts, viewports mobile e desktop
- [ ] 3.3 Criar estrutura de pastas `e2e/` com arquivos por funcionalidade

### Testes de busca
- [ ] 3.4 Teste: busca por cidade válida exibe clima atual (temperatura, umidade, vento visíveis na tela)
- [ ] 3.5 Teste: busca por cidade válida exibe seção de previsão hora a hora (gráfico presente no DOM)
- [ ] 3.6 Teste: busca por cidade válida exibe 7 cards de previsão semanal
- [ ] 3.7 Teste: cidade inexistente exibe mensagem de erro amigável (texto de erro visível, sem dados climáticos)
- [ ] 3.8 Teste: botão retry após erro exibe o campo de busca novamente

### Testes de geolocalização
- [ ] 3.9 Teste: clicar no botão de geolocalização com permissão mockada → dados climáticos exibidos
- [ ] 3.10 Teste: permissão de geolocalização negada → mensagem de feedback adequada

### Testes de UX/visual
- [ ] 3.11 Teste: skeleton loading visível durante fetch (interceptar requisição e atrasar resposta)
- [ ] 3.12 Teste: background muda visivelmente entre cidade fria e cidade quente (verificar estilo computado)

### Testes de responsividade
- [ ] 3.13 Teste mobile (375x812): elementos principais visíveis sem overflow horizontal
- [ ] 3.14 Teste desktop (1440x900): layout expandido sem elementos esticados

## Detalhes de Implementação

Consultar `techspec.md` — seção:

- **Abordagem de Testes → Testes de E2E** para diretrizes gerais
- **Endpoints de API → Backend** para os contratos usados nos mocks/intercepts

**Estrutura sugerida de arquivos E2E:**
```
e2e/
  search.spec.ts          ← fluxos de busca por cidade
  geolocation.spec.ts     ← fluxos de geolocalização
  error-states.spec.ts    ← estados de erro e retry
  responsive.spec.ts      ← testes de viewport
playwright.config.ts
```

**Exemplo de mock de geolocalização com Playwright:**
```typescript
await context.setGeolocation({ latitude: -25.43, longitude: -49.27 });
await context.grantPermissions(['geolocation']);
```

**Exemplo de interceptação para testar skeleton loading:**
```typescript
await page.route('**/api/weather**', async route => {
  await new Promise(r => setTimeout(r, 1500)); // atraso artificial
  await route.continue();
});
```

## Critérios de Sucesso

- `npx playwright test` executa todos os testes sem falhas
- Relatório HTML do Playwright gerado com todos os testes em verde
- Nenhum teste com `await page.waitForTimeout()` fixo — usar `waitFor` baseado em elementos/estado
- Testes passam de forma estável em 3 execuções consecutivas (sem flakiness)

## Testes da Tarefa

```bash
# Executar todos os testes E2E
npx playwright test

# Executar com relatório visual
npx playwright test --reporter=html

# Executar apenas testes de busca
npx playwright test e2e/search.spec.ts

# Executar em modo headed (browser visível) para debug
npx playwright test --headed

# Executar em viewport mobile
npx playwright test --project=mobile
```

<critical>SEMPRE EXECUTE `npx playwright test` E CONFIRME QUE TODOS OS TESTES PASSAM ANTES DE CONSIDERAR A TAREFA FINALIZADA</critical>

## Arquivos Relevantes

**Criados:**
- `playwright.config.ts`
- `e2e/search.spec.ts`
- `e2e/geolocation.spec.ts`
- `e2e/error-states.spec.ts`
- `e2e/responsive.spec.ts`

**Dependências:**
- `backend/src/server.ts` (deve estar rodando em :3000)
- `frontend/src/App.tsx` (deve estar rodando em :5173)

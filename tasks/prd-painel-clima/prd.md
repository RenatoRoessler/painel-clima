# PRD — Painel de Clima

## Visão Geral

O Painel de Clima é uma aplicação web voltada ao uso geral e pessoal que permite a qualquer usuário consultar as condições climáticas de qualquer cidade do mundo de forma visual, clara e agradável. O usuário digita o nome de uma cidade e recebe instantaneamente dados do clima atual, previsão hora a hora e previsão para os próximos 7 dias, sem precisar navegar em múltiplas telas ou interpretar dados brutos.

O projeto é construído sobre uma arquitetura full stack com frontend em React e backend em Node.js. O backend atua como intermediário entre o frontend e a API pública Open-Meteo, mantendo a lógica de integração externa isolada do cliente.

---

## Objetivos

- Permitir que qualquer usuário consulte o clima atual de uma cidade em menos de 3 segundos.
- Apresentar previsões de temperatura, precipitação e vento de forma visual e intuitiva, sem necessidade de conhecimento técnico.
- Oferecer uma experiência responsiva que funcione bem tanto em dispositivos móveis quanto em desktop.
- Garantir feedback claro ao usuário em todas as situações: carregamento, erro e cidade não encontrada.

---

## Histórias de Usuário

**Usuário primário: pessoa comum que quer saber o clima de uma cidade.**

- Como usuário, quero digitar o nome de uma cidade e ver o clima atual, para saber se preciso de guarda-chuva ou agasalho.
- Como usuário, quero ver a previsão hora a hora de temperatura e precipitação, para planejar meu dia.
- Como usuário, quero ver a previsão dos próximos 7 dias com temperaturas mínimas e máximas, para planejar a semana.
- Como usuário, quero usar minha localização atual automaticamente, para não precisar digitar minha cidade.
- Como usuário, quero receber uma mensagem clara quando a cidade não for encontrada, para entender o que aconteceu e tentar novamente.
- Como usuário, quero ver um indicador visual enquanto os dados carregam, para saber que a aplicação está funcionando.
- Como usuário, quero ver elementos visuais que reflitam a temperatura e o clima atual (cores, ícones, background), para ter uma experiência mais imersiva e intuitiva.

---

## Funcionalidades Principais

### 1. Busca de Cidade

**O que faz:** Permite que o usuário informe o nome de uma cidade para consultar o clima.

**Por que é importante:** É o ponto de entrada principal da aplicação.

**Requisitos funcionais:**
- RF-01: Campo de texto para digitar o nome da cidade, sem autocomplete.
- RF-02: Submissão da busca por tecla Enter ou botão de busca.
- RF-03: Feedback visual de loading durante a busca.
- RF-04: Mensagem amigável quando a cidade não for encontrada (status 404).
- RF-05: Mensagem de erro genérica com opção de retry em caso de falha na requisição.

### 2. Geolocalização

**O que faz:** Detecta a localização atual do usuário via browser e carrega o clima da cidade correspondente automaticamente.

**Por que é importante:** Elimina a necessidade de digitação e melhora a experiência inicial.

**Requisitos funcionais:**
- RF-06: Botão de geolocalização visível na interface.
- RF-07: Solicitação de permissão de localização ao browser ao clicar no botão.
- RF-08: Uso das coordenadas retornadas pelo browser para buscar o clima via backend.
- RF-09: Feedback de loading durante o processo de geolocalização e busca.

### 3. Clima Atual

**O que faz:** Exibe as condições climáticas da cidade consultada no momento atual.

**Por que é importante:** É a informação mais relevante para o usuário e o foco principal do painel.

**Requisitos funcionais:**
- RF-10: Exibição de temperatura atual.
- RF-11: Exibição de umidade relativa do ar.
- RF-12: Exibição de velocidade do vento.
- RF-13: Exibição do índice UV com barra visual de gradiente (verde → vermelho).
- RF-14: Exibição de precipitação atual.
- RF-15: Ícones animados que refletem a condição climática atual (sol, chuva, nublado, etc.).
- RF-16: Background da tela com gradiente dinâmico baseado na temperatura atual (ex: tons frios para baixas temperaturas, tons quentes para altas).

### 4. Previsão Hora a Hora

**O que faz:** Exibe a previsão de temperatura e precipitação para as próximas horas do dia.

**Por que é importante:** Ajuda o usuário a planejar atividades ao longo do dia.

**Requisitos funcionais:**
- RF-17: Gráfico interativo exibindo temperatura e precipitação hora a hora.
- RF-18: Período mínimo de 24 horas exibido no gráfico.

### 5. Previsão de 7 Dias

**O que faz:** Exibe a previsão para os próximos 7 dias com temperaturas mínima e máxima e precipitação esperada.

**Por que é importante:** Permite planejamento de médio prazo ao usuário.

**Requisitos funcionais:**
- RF-19: Cards individuais para cada dia da semana.
- RF-20: Exibição de temperatura mínima e máxima por dia.
- RF-21: Barra visual indicando a faixa de temperatura do dia em relação ao intervalo da semana.
- RF-22: Exibição de precipitação esperada por dia.

### 6. Skeleton Loading

**O que faz:** Exibe placeholders animados enquanto os dados estão sendo carregados.

**Por que é importante:** Reduz a percepção de espera e indica que a aplicação está ativa.

**Requisitos funcionais:**
- RF-23: Skeleton loading aplicado a todos os cards e seções enquanto a requisição está em andamento.

---

## Experiência do Usuário

**Persona:** Usuário adulto, com acesso a smartphone ou computador, que quer consultar o clima de forma rápida e sem fricção. Não possui conhecimento técnico sobre meteorologia ou APIs.

**Fluxo principal:**
1. Usuário acessa a aplicação.
2. Digita o nome de uma cidade ou clica no botão de geolocalização.
3. A interface exibe skeleton loading enquanto os dados são buscados.
4. Os dados do clima atual, previsão hora a hora e previsão de 7 dias são exibidos.
5. O background e as cores da interface se adaptam à temperatura e condição climática da cidade.

**Fluxo de erro:**
1. Usuário digita uma cidade inexistente.
2. A interface exibe mensagem amigável informando que a cidade não foi encontrada.
3. O campo de busca permanece disponível para nova tentativa.

**Diretrizes de UI/UX:**
- Design mobile-first, responsivo para todas as resoluções.
- Cores dinâmicas baseadas no clima atual (tons azuis para céu limpo, cinzas para nublado, etc.).
- Background com gradiente que reflete a temperatura atual da cidade selecionada.
- Barra visual do índice UV com gradiente de cores (verde para baixo, amarelo para moderado, vermelho para alto).
- Cards de 7 dias com barras visuais de temperatura mín/máx.
- Interface inteiramente em Português (BR).
- Acessibilidade básica: contraste adequado, textos legíveis, elementos interativos identificáveis.

---

## Restrições Técnicas de Alto Nível

- **Integração externa:** A aplicação depende da API pública Open-Meteo (Geocoding API e Weather API). O frontend não deve se comunicar diretamente com a Open-Meteo — toda comunicação externa passa pelo backend.
- **Protocolo de comunicação frontend-backend:** O frontend consome exclusivamente o endpoint `GET /api/weather?city=<cidade>` exposto pelo backend.
- **Geocodificação:** A conversão de nome de cidade em coordenadas geográficas é responsabilidade do backend.
- **Geolocalização:** Quando o usuário aciona a geolocalização, as coordenadas são obtidas pelo browser (frontend) e enviadas ao backend para busca dos dados climáticos.
- **Sem cache:** Não há requisito de cache no backend para este escopo. Cada requisição busca dados frescos da Open-Meteo.
- **Sem autenticação:** A aplicação não requer login, autenticação ou controle de acesso.
- **Idioma único:** Interface exclusivamente em Português do Brasil. Sem suporte a internacionalização (i18n).
- **Ambiente:** A aplicação deve rodar localmente. Não há requisito de deploy em produção para este escopo.

---

## Fora de Escopo

- Tema claro/escuro (dark/light mode) — não será implementado.
- Autocomplete no campo de busca de cidade.
- Histórico de buscas anteriores.
- Comparação entre cidades.
- Notificações ou alertas climáticos.
- Internacionalização (i18n) ou suporte a idiomas além do Português (BR).
- Autenticação, login ou perfis de usuário.
- Deploy em ambiente de produção ou cloud.
- Cache de dados no backend.
- Acesso direto do frontend à API Open-Meteo.

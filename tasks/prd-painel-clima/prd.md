# PRD — Painel de Clima

## Visão Geral

O Painel de Clima é uma aplicação web de acesso livre que permite ao público geral consultar as condições climáticas de qualquer cidade do mundo. O usuário informa o nome de uma cidade (ou usa sua localização atual) e recebe em tempo real dados de temperatura, umidade, vento, UV e precipitação, além de previsões horárias e para os próximos 7 dias. O painel resolve a necessidade de ter informação climática clara, visual e responsiva em um único lugar, sem exigir cadastro ou instalação.

---

## Objetivos

- Permitir que qualquer usuário consulte o clima atual de uma cidade em menos de 3 segundos após a busca.
- Exibir previsão climática hora a hora (24h) e para os próximos 7 dias de forma visual e intuitiva.
- Oferecer experiência responsiva e acessível em dispositivos móveis e desktop.
- Transmitir a sensação climática atual através de elementos visuais dinâmicos (cores, ícones, fundo).
- Garantir feedback claro ao usuário em todos os estados: carregamento, erro e sucesso.

---

## Histórias de Usuário

- Como **usuário do público geral**, quero digitar o nome de uma cidade e ver o clima atual para que eu saiba se preciso levar guarda-chuva ou agasalho.
- Como **usuário móvel**, quero que a interface se adapte ao meu celular para que eu consiga consultar o clima com facilidade em qualquer dispositivo.
- Como **usuário em movimento**, quero usar minha localização atual para que não precise digitar o nome da cidade manualmente.
- Como **usuário**, quero ver a previsão hora a hora em um gráfico interativo para que eu planeje meu dia com mais precisão.
- Como **usuário**, quero ver a previsão dos próximos 7 dias para que eu possa planejar a semana.
- Como **usuário**, quero receber uma mensagem amigável quando a cidade não for encontrada para que eu saiba o que fazer em seguida.
- Como **usuário**, quero que o visual da página reflita a temperatura atual para que eu tenha uma percepção imediata do clima ao abrir o painel.

---

## Funcionalidades Principais

### 1. Busca de Cidade

O painel exibe um campo de texto onde o usuário digita o nome de uma cidade. Não há autocomplete. Ao submeter a busca, o sistema retorna os dados climáticos da cidade informada.

**Requisitos funcionais:**
1. RF-01: O campo de busca deve aceitar texto livre com o nome da cidade.
2. RF-02: Não deve haver sugestões automáticas (autocomplete desativado).
3. RF-03: Deve exibir feedback visual de carregamento enquanto os dados são buscados.
4. RF-04: Deve exibir mensagem amigável com opção de nova tentativa quando a cidade não for encontrada.
5. RF-05: Deve tratar erros de dados ausentes com mensagem clara ao usuário.

### 2. Geolocalização

O usuário pode optar por usar sua localização atual em vez de digitar uma cidade.

**Requisitos funcionais:**
6. RF-06: Deve haver um botão de geolocalização que aciona a API de localização do navegador.
7. RF-07: Ao obter as coordenadas, o sistema deve buscar e exibir os dados climáticos do local.
8. RF-08: Deve exibir feedback visual de carregamento durante a obtenção da localização e dos dados.

### 3. Clima Atual

Exibição em destaque das condições climáticas no momento da consulta.

**Requisitos funcionais:**
9. RF-09: Deve exibir temperatura atual, sensação térmica, umidade, velocidade do vento, índice UV e precipitação.
10. RF-10: Deve exibir ícone animado correspondente à condição climática (ex.: sol, nuvem, chuva).
11. RF-11: O background da página deve usar gradiente de cores baseado na temperatura atual, refletindo visualmente o clima do local.
12. RF-12: A barra de índice UV deve usar gradiente visual de verde a vermelho conforme o nível de exposição.

### 4. Previsão Hora a Hora

Visualização gráfica e interativa da previsão climática para as próximas horas do dia.

**Requisitos funcionais:**
13. RF-13: Deve exibir temperatura e precipitação por hora em um gráfico interativo.
14. RF-14: O gráfico deve permitir interação do usuário (hover/tooltip com valores).

### 5. Previsão de 7 Dias

Resumo visual da previsão para os próximos sete dias.

**Requisitos funcionais:**
15. RF-15: Deve exibir um card por dia com temperatura mínima, máxima e precipitação.
16. RF-16: Cada card deve conter barras visuais representando a faixa de temperatura do dia.

### 6. Estados de Interface

**Requisitos funcionais:**
17. RF-17: Deve exibir skeleton loading em todos os cards durante o carregamento dos dados.
18. RF-18: Deve exibir estado de erro com mensagem descritiva e botão de retry em caso de falha na requisição.

---

## Experiência do Usuário

**Personas:**
- Usuário mobile casual: acessa via smartphone para consulta rápida antes de sair de casa.
- Usuário desktop: acompanha o clima ao longo do dia enquanto trabalha.

**Fluxos principais:**
1. Usuário acessa o painel → vê campo de busca → digita cidade → aguarda carregamento (skeleton) → visualiza dados climáticos completos.
2. Usuário acessa o painel → clica em geolocalização → aguarda permissão e carregamento → visualiza dados do local atual.
3. Usuário digita cidade inexistente → vê mensagem de erro amigável → tenta nova busca.

**Diretrizes de UI/UX:**
- Design responsivo com abordagem mobile-first.
- Cores dinâmicas baseadas no clima: tons azuis para céu limpo, tons cinzas para nublado, tons escuros para chuva, gradientes quentes para altas temperaturas.
- Ícones animados que reforçam visualmente a condição climática.
- Todos os estados de carregamento representados por skeleton screens, nunca spinners genéricos.
- Interface inteiramente em português (PT-BR).
- Acessibilidade: contraste suficiente entre texto e fundo, mesmo com backgrounds dinâmicos.

---

## Restrições Técnicas de Alto Nível

- O frontend deve consumir exclusivamente a API do backend — nunca acessar diretamente a API externa Open-Meteo.
- O backend é responsável por converter o nome da cidade em coordenadas geográficas e por buscar os dados climáticos na Open-Meteo.
- O endpoint principal do backend é `GET /api/weather?city=<cidade>`, retornando HTTP 200 (sucesso), 400 (parâmetros ausentes) ou 404 (cidade não encontrada).
- Dados exibidos são sempre ao vivo, sem cache no backend.
- Aplicação implementada nos projetos existentes em `./frontend` (React) e `./backend` (Node.js).
- Não há requisitos de autenticação; o acesso é completamente público.

---

## Fora de Escopo

- Tema claro/escuro — não será implementado.
- Autocomplete no campo de busca de cidade.
- Histórico de cidades pesquisadas ou cidades favoritas.
- Autenticação ou gerenciamento de usuários.
- Suporte a múltiplos idiomas (somente PT-BR).
- Cache de dados no backend.
- Notificações push ou alertas climáticos.
- Mapas ou visualizações geográficas.

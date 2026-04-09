---
name: styled-components-helper
description: Use esta skill para estilização com styled-components em React/Next.js. Use quando criar componentes, páginas ou aplicar estilos.
---

# Diretrizes de Estilização com Styled Components

Quando solicitado a estilizar ou criar componentes, siga estas regras:

1. **Estrutura:** Crie componentes estilizados separadamente ou no final do arquivo, preferindo a convenção `styled.div`, `styled.button`, etc.
2. **Temas:** Utilize `styled-components` ThemeProvider para gerenciar cores, espaçamentos e tipografia.
3. **Props Dinâmicas:** Use propriedades (props) para estilos dinâmicos, garantindo a tipagem com TypeScript (ex: `${props => props.primary ? 'blue' : 'gray'}`).
4. **Boas Práticas:**
   - Evite estilos inline.
   - Reutilize componentes estilizados.
   - Adicione comentários para estilos complexos.
5. **Nomenclatura:** Use PascalCase para componentes estilizados (ex: `Container`, `StyledButton`).

**Exemplo de saída esperada:**

```jsx
import styled from "styled-components";

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }
`;
```

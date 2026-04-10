import styled from 'styled-components';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const isCityNotFound = message.toLowerCase().includes('não encontrada');

  return (
    <Container>
      <Icon>{isCityNotFound ? '🔍' : '⚠️'}</Icon>
      <Title>{isCityNotFound ? 'Cidade não encontrada' : 'Ops! Algo deu errado'}</Title>
      <Description>
        {isCityNotFound
          ? 'Verifique o nome da cidade e tente novamente.'
          : 'Não foi possível carregar os dados climáticos. Verifique sua conexão e tente novamente.'}
      </Description>
      <RetryButton onClick={onRetry}>Tentar novamente</RetryButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 20px;
  color: #fff;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 56px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
`;

const Description = styled.p`
  font-size: 15px;
  opacity: 0.8;
  margin: 0;
  max-width: 360px;
`;

const RetryButton = styled.button`
  padding: 12px 28px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

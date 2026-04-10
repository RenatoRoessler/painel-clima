import styled from 'styled-components';

export const AppWrapper = styled.div<{ $gradient: string }>`
  min-height: 100vh;
  background: ${({ $gradient }) => $gradient};
  transition: background 1s ease;
  padding: 24px 16px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Header = styled.header`
  text-align: center;
  padding: 16px 0 8px;
`;

export const AppTitle = styled.h1`
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 300;
  color: rgba(255,255,255,0.9);
  margin: 0 0 20px;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export const ErrorBox = styled.div`
  background: rgba(0,0,0,0.25);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  color: #fff;
`;

export const ErrorTitle = styled.h2`
  font-size: 24px;
  margin: 0 0 8px;
`;

export const ErrorMessage = styled.p`
  color: rgba(255,255,255,0.8);
  margin: 0 0 20px;
`;

export const RetryButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.4);
  color: #fff;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255,255,255,0.35);
  }
`;

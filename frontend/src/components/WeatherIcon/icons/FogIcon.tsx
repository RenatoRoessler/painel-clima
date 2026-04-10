import styled, { keyframes } from 'styled-components';

const drift = keyframes`
  0%, 100% { transform: translateX(0); opacity: 0.7; }
  50% { transform: translateX(8px); opacity: 1; }
`;

const drift2 = keyframes`
  0%, 100% { transform: translateX(0); opacity: 0.5; }
  50% { transform: translateX(-8px); opacity: 0.9; }
`;

const Line1 = styled.line`
  animation: ${drift} 3s ease-in-out infinite;
`;

const Line2 = styled.line`
  animation: ${drift2} 3.5s ease-in-out infinite;
`;

const Line3 = styled.line`
  animation: ${drift} 4s ease-in-out infinite;
`;

export function FogIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <Line1 x1="12" y1="30" x2="68" y2="30" stroke="#B0BEC5" strokeWidth="4" strokeLinecap="round" />
      <Line2 x1="18" y1="42" x2="62" y2="42" stroke="#90A4AE" strokeWidth="4" strokeLinecap="round" />
      <Line3 x1="12" y1="54" x2="68" y2="54" stroke="#B0BEC5" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

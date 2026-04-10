import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const drop = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(18px); opacity: 0; }
`;

const CloudGroup = styled.g`
  animation: ${float} 3s ease-in-out infinite;
`;

const Drop = styled.line<{ $delay: number }>`
  animation: ${drop} 0.8s ease-in infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;

export function RainIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <CloudGroup>
        <ellipse cx="40" cy="32" rx="24" ry="14" fill="#778899" />
        <circle cx="28" cy="28" r="10" fill="#778899" />
        <circle cx="46" cy="24" r="14" fill="#8899AA" />
      </CloudGroup>
      {[26, 36, 46, 56].map((x, i) => (
        <Drop key={x} x1={x} y1="50" x2={x - 4} y2="62" stroke="#4FC3F7" strokeWidth="2.5" strokeLinecap="round" $delay={i * 0.2} />
      ))}
    </svg>
  );
}

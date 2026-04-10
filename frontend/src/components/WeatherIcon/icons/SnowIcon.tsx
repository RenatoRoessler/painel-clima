import styled, { keyframes } from 'styled-components';

const fallRotate = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(20px) rotate(180deg); opacity: 0; }
`;

const Flake = styled.text<{ $delay: number }>`
  animation: ${fallRotate} 1.2s ease-in infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  font-size: 14px;
  fill: #AED6F1;
`;

export function SnowIcon({ size = 80 }: { size?: number }) {
  const flakes = [
    { x: 24, y: 54, delay: 0 },
    { x: 36, y: 50, delay: 0.3 },
    { x: 48, y: 54, delay: 0.6 },
    { x: 30, y: 60, delay: 0.9 },
    { x: 44, y: 60, delay: 0.15 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="30" rx="24" ry="13" fill="#B0C4DE" />
      <circle cx="28" cy="26" r="11" fill="#B0C4DE" />
      <circle cx="46" cy="22" r="15" fill="#C8D8E8" />
      {flakes.map(({ x, y, delay }, i) => (
        <Flake key={i} x={x} y={y} $delay={delay} textAnchor="middle">❄</Flake>
      ))}
    </svg>
  );
}

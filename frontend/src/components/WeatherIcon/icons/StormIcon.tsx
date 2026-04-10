import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const flash = keyframes`
  0%, 90%, 100% { opacity: 1; }
  95% { opacity: 0.1; }
`;

const CloudGroup = styled.g`
  animation: ${float} 2.5s ease-in-out infinite;
`;

const Lightning = styled.polyline`
  animation: ${flash} 2s ease-in-out infinite;
`;

export function StormIcon({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <CloudGroup>
        <ellipse cx="40" cy="30" rx="26" ry="14" fill="#5C6B7A" />
        <circle cx="26" cy="26" r="12" fill="#5C6B7A" />
        <circle cx="46" cy="22" r="16" fill="#6B7A8A" />
      </CloudGroup>
      <Lightning points="42,46 34,58 40,58 36,72 50,52 44,52" stroke="#FFD700" strokeWidth="2" fill="#FFD700" strokeLinejoin="round" />
    </svg>
  );
}

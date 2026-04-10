import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.08); }
`;

const SunWrapper = styled.div`
  display: inline-flex;
  animation: ${pulse} 10s ease-in-out infinite;
`;

const SunSvg = styled.svg`
  animation: ${spin} 20s linear infinite;
`;

export function SunIcon({ size = 80 }: { size?: number }) {
  return (
    <SunWrapper>
      <SunSvg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="18" fill="#FFD700" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="40"
            y1="8"
            x2="40"
            y2="16"
            stroke="#FFD700"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 40 40)`}
          />
        ))}
      </SunSvg>
    </SunWrapper>
  );
}

import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const CloudSvg = styled.svg`
  animation: ${float} 3s ease-in-out infinite;
`;

export function CloudIcon({ size = 80 }: { size?: number }) {
  return (
    <CloudSvg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="46" rx="28" ry="16" fill="#B0C4DE" />
      <circle cx="30" cy="40" r="14" fill="#B0C4DE" />
      <circle cx="48" cy="36" r="18" fill="#C8D8E8" />
      <circle cx="28" cy="38" r="12" fill="#C8D8E8" />
    </CloudSvg>
  );
}

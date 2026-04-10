import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const baseShimmer = `
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 8px;
`;

export const SkeletonCard = styled.div<{ $width?: string; $height?: string }>`
  ${baseShimmer}
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height ?? '120px'};
`;

export const SkeletonLine = styled.div<{ $width?: string }>`
  ${baseShimmer}
  width: ${({ $width }) => $width ?? '100%'};
  height: 16px;
  margin-bottom: 8px;
`;

export const SkeletonCircle = styled.div<{ $size?: string }>`
  ${baseShimmer}
  width: ${({ $size }) => $size ?? '64px'};
  height: ${({ $size }) => $size ?? '64px'};
  border-radius: 50%;
`;

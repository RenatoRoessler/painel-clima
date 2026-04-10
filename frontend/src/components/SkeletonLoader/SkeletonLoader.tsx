import { SkeletonCard, SkeletonLine, SkeletonCircle } from './SkeletonLoader.styles';

interface SkeletonLoaderProps {
  variant: 'card' | 'line' | 'circle';
  width?: string;
  height?: string;
  size?: string;
}

export function SkeletonLoader({ variant, width, height, size }: SkeletonLoaderProps) {
  if (variant === 'card') return <SkeletonCard $width={width} $height={height} />;
  if (variant === 'circle') return <SkeletonCircle $size={size} />;
  return <SkeletonLine $width={width} />;
}

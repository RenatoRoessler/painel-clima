import { UVContainer, UVLabel, UVTrack, UVIndicator, UVValue } from './UVBar.styles';

interface UVBarProps {
  uvIndex: number;
}

function getUVLabel(uv: number): string {
  if (uv <= 2) return 'Baixo';
  if (uv <= 5) return 'Moderado';
  if (uv <= 7) return 'Alto';
  if (uv <= 10) return 'Muito Alto';
  return 'Extremo';
}

export function UVBar({ uvIndex }: UVBarProps) {
  const position = Math.min((uvIndex / 11) * 100, 100);

  return (
    <UVContainer>
      <UVLabel>
        <span>Baixo</span>
        <span>Moderado</span>
        <span>Alto</span>
        <span>Mto Alto</span>
        <span>Extremo</span>
      </UVLabel>
      <UVTrack>
        <UVIndicator $position={position} />
      </UVTrack>
      <UVValue>UV {uvIndex} — {getUVLabel(uvIndex)}</UVValue>
    </UVContainer>
  );
}

import styled from 'styled-components';

interface UVBarProps {
  value: number;
}

const MAX_UV = 11;

function getUVLabel(value: number): string {
  if (value <= 2) return 'Baixo';
  if (value <= 5) return 'Moderado';
  if (value <= 7) return 'Alto';
  if (value <= 10) return 'Muito alto';
  return 'Extremo';
}

export function UVBar({ value }: UVBarProps) {
  const percentage = Math.min((value / MAX_UV) * 100, 100);
  return (
    <Container>
      <Label>
        <span>Índice UV</span>
        <span>
          {value.toFixed(1)} — {getUVLabel(value)}
        </span>
      </Label>
      <Track>
        <Fill style={{ width: `${percentage}%` }} />
      </Track>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 6px;
`;

const Track = styled.div`
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(to right, #00b09b, #ffcc00, #ff0000);
  transition: width 0.4s ease;
`;

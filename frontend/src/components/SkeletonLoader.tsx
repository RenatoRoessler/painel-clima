import styled, { keyframes } from 'styled-components';

export function SkeletonLoader() {
  return (
    <Container>
      <SkeletonBlock $width="180px" $height="36px" $radius="8px" />
      <SkeletonBlock $width="120px" $height="80px" $radius="8px" />
      <Row>
        <SkeletonBlock $width="100%" $height="80px" $radius="12px" />
        <SkeletonBlock $width="100%" $height="80px" $radius="12px" />
        <SkeletonBlock $width="100%" $height="80px" $radius="12px" />
      </Row>
      <SkeletonBlock $width="100%" $height="220px" $radius="12px" />
      <Column>
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonBlock key={i} $width="100%" $height="48px" $radius="10px" />
        ))}
      </Column>
    </Container>
  );
}

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 32px 20px;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
`;

const SkeletonBlock = styled.div<{ $width: string; $height: string; $radius: string }>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border-radius: ${({ $radius }) => $radius};
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.18) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 480px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

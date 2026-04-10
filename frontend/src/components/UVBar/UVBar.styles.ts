import styled from 'styled-components';

export const UVContainer = styled.div`
  width: 100%;
`;

export const UVLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
`;

export const UVTrack = styled.div`
  position: relative;
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(90deg, #4caf50, #8bc34a, #ffeb3b, #ff9800, #f44336);
`;

export const UVIndicator = styled.div<{ $position: number }>`
  position: absolute;
  top: 50%;
  left: ${({ $position }) => $position}%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid rgba(0, 0, 0, 0.4);
  transition: left 0.5s ease;
`;

export const UVValue = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
`;

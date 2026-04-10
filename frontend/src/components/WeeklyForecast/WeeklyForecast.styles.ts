import styled from 'styled-components';

export const WeeklyContainer = styled.div`
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 20px;
`;

export const SectionTitle = styled.h3`
  color: rgba(255,255,255,0.8);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 16px;
`;

export const DayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);

  &:last-child {
    border-bottom: none;
  }
`;

export const DayName = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
`;

export const TempRange = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

export const TempMin = styled.span`
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  min-width: 32px;
  text-align: right;
`;

export const TempMax = styled.span`
  color: #fff;
  font-size: 13px;
  min-width: 32px;
`;

export const TempBarTrack = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255,255,255,0.15);
  position: relative;
`;

export const TempBarFill = styled.div<{ $left: number; $width: number }>`
  position: absolute;
  top: 0;
  left: ${({ $left }) => $left}%;
  width: ${({ $width }) => $width}%;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #64b5f6, #ffb74d);
  transition: all 0.5s ease;
`;

import styled from 'styled-components';

export const WeatherHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

export const CityName = styled.h2`
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
`;

export const Temperature = styled.div`
  font-size: clamp(56px, 12vw, 96px);
  font-weight: 300;
  color: #fff;
  line-height: 1;
  text-shadow: 0 4px 16px rgba(0,0,0,0.3);
`;

export const FeelsLike = styled.div`
  font-size: 16px;
  color: rgba(255,255,255,0.8);
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

export const InfoCard = styled.div`
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #fff;
`;

export const InfoUnit = styled.span`
  font-size: 14px;
  font-weight: 400;
`;

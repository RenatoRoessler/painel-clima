import styled from 'styled-components';

export const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 16px;
  backdrop-filter: blur(8px);
  outline: none;
  transition: background 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const IconButton = styled.button`
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

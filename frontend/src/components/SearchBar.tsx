import { useState } from 'react';
import styled from 'styled-components';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGeolocate: () => void;
  loading: boolean;
}

export function SearchBar({ onSearch, onGeolocate, loading }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Digite o nome de uma cidade..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading}
        autoComplete="off"
      />
      <SearchButton type="submit" disabled={loading || !value.trim()}>
        {loading ? 'Buscando...' : 'Buscar'}
      </SearchButton>
      <GeoButton type="button" onClick={onGeolocate} disabled={loading} title="Usar minha localização">
        📍
      </GeoButton>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  backdrop-filter: blur(8px);
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SearchButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.35);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GeoButton = styled.button`
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.35);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

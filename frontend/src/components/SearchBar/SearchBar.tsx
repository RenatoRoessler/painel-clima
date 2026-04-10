import { useState, type KeyboardEvent } from 'react';
import { SearchContainer, SearchInput, IconButton } from './SearchBar.styles';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGeolocate: () => void;
  loading: boolean;
}

export function SearchBar({ onSearch, onGeolocate, loading }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Buscar cidade..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <IconButton onClick={handleSearch} disabled={loading || !value.trim()} aria-label="Buscar">
        {loading ? '⏳' : '🔍'}
      </IconButton>
      <IconButton onClick={onGeolocate} disabled={loading} aria-label="Usar minha localização">
        📍
      </IconButton>
    </SearchContainer>
  );
}

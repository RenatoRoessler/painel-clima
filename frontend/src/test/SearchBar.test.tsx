import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../components/SearchBar';

describe('SearchBar', () => {
  it('renderiza input e botão de busca', () => {
    render(<SearchBar onSearch={vi.fn()} onGeolocate={vi.fn()} loading={false} />);
    expect(screen.getByPlaceholderText(/Digite o nome de uma cidade/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buscar/i })).toBeInTheDocument();
  });

  it('chama onSearch com o valor digitado ao submeter', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} onGeolocate={vi.fn()} loading={false} />);

    const input = screen.getByPlaceholderText(/Digite o nome de uma cidade/i);
    await userEvent.type(input, 'São Paulo');
    await userEvent.click(screen.getByRole('button', { name: /Buscar/i }));

    expect(onSearch).toHaveBeenCalledWith('São Paulo');
  });

  it('desabilita input e botão quando loading é true', () => {
    render(<SearchBar onSearch={vi.fn()} onGeolocate={vi.fn()} loading={true} />);
    expect(screen.getByPlaceholderText(/Digite o nome de uma cidade/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /Buscando/i })).toBeDisabled();
  });

  it('renderiza botão de geolocalização', () => {
    render(<SearchBar onSearch={vi.fn()} onGeolocate={vi.fn()} loading={false} />);
    expect(screen.getByTitle(/Usar minha localização/i)).toBeInTheDocument();
  });
});

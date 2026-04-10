import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from '../components/ErrorMessage';

describe('ErrorMessage', () => {
  it('renderiza mensagem de cidade não encontrada', () => {
    render(<ErrorMessage message="Cidade não encontrada" onRetry={vi.fn()} />);
    expect(screen.getByText('Cidade não encontrada')).toBeInTheDocument();
  });

  it('renderiza mensagem genérica de erro de rede', () => {
    render(<ErrorMessage message="Erro de conexão" onRetry={vi.fn()} />);
    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
  });

  it('renderiza botão de retry', () => {
    render(<ErrorMessage message="Erro qualquer" onRetry={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Tentar novamente/i })).toBeInTheDocument();
  });

  it('chama onRetry ao clicar no botão', async () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Erro qualquer" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: /Tentar novamente/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

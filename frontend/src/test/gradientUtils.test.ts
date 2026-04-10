import { describe, it, expect } from 'vitest';
import { getTemperatureGradient } from '../utils/gradientUtils';

describe('getTemperatureGradient', () => {
  it('retorna azul noturno para temperatura abaixo de 0°C', () => {
    const result = getTemperatureGradient(-5);
    expect(result).toContain('#1a1a2e');
    expect(result).toContain('#16213e');
  });

  it('retorna azul noturno para 0°C', () => {
    const result = getTemperatureGradient(0);
    expect(result).toContain('#1a1a2e');
    expect(result).toContain('#16213e');
  });

  it('retorna verde-azul para temperatura entre 1°C e 10°C', () => {
    const result = getTemperatureGradient(5);
    expect(result).toContain('#2d6a4f');
    expect(result).toContain('#1e3a5f');
  });

  it('retorna verde-azul para 10°C', () => {
    const result = getTemperatureGradient(10);
    expect(result).toContain('#2d6a4f');
    expect(result).toContain('#1e3a5f');
  });

  it('retorna verde-turquesa para temperatura entre 11°C e 20°C', () => {
    const result = getTemperatureGradient(15);
    expect(result).toContain('#52b69a');
    expect(result).toContain('#168aad');
  });

  it('retorna laranja-quente para temperatura entre 21°C e 28°C', () => {
    const result = getTemperatureGradient(25);
    expect(result).toContain('#f77f00');
    expect(result).toContain('#d62828');
  });

  it('retorna vermelho-intenso para temperatura acima de 28°C', () => {
    const result = getTemperatureGradient(35);
    expect(result).toContain('#d62828');
    expect(result).toContain('#6a0572');
  });
});

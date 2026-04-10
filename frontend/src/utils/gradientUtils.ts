interface GradientConfig {
  from: string;
  to: string;
}

const TEMPERATURE_GRADIENTS: Array<{ maxTemp: number; gradient: GradientConfig }> = [
  { maxTemp: 0, gradient: { from: '#1a1a2e', to: '#16213e' } },
  { maxTemp: 10, gradient: { from: '#2d6a4f', to: '#1e3a5f' } },
  { maxTemp: 20, gradient: { from: '#52b69a', to: '#168aad' } },
  { maxTemp: 28, gradient: { from: '#f77f00', to: '#d62828' } },
  { maxTemp: Infinity, gradient: { from: '#d62828', to: '#6a0572' } },
];

export function getTemperatureGradient(temperature: number): string {
  const config = TEMPERATURE_GRADIENTS.find((entry) => temperature <= entry.maxTemp);
  const gradient = config?.gradient ?? TEMPERATURE_GRADIENTS[TEMPERATURE_GRADIENTS.length - 1].gradient;
  return `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`;
}

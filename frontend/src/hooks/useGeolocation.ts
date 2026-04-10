import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPosition = useCallback((): Promise<{ lat: number; lon: number }> => {
    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setLoading(false);
        setError('Geolocalização não suportada neste navegador.');
        reject(new Error('Geolocalização não suportada neste navegador.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          setLoading(false);
          setError('Permissão de localização negada.');
          reject(new Error('Permissão de localização negada.'));
        }
      );
    });
  }, []);

  return { getPosition, loading, error };
}

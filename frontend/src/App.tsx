import { useEffect, useState } from "react";

type BackendStatus = {
  status: string;
  service: string;
  timestamp: string;
};

function App() {
  const [data, setData] = useState<BackendStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/status");

        if (!response.ok) {
          throw new Error(`Erro ao consultar backend: ${response.status}`);
        }

        const json = (await response.json()) as BackendStatus;
        setData(json);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro inesperado ao consultar backend";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: "24px" }}>
      <h1>Status do Backend</h1>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!loading && !error && (
        <pre
          style={{
            background: "#f4f4f4",
            borderRadius: "8px",
            padding: "12px",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}

export default App;

import { Router, Request, Response } from "express";
import { getWeatherByCity } from "../services/weatherService";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const city = req.query.city as string | undefined;

  if (!city) {
    res.status(400).json({ error: "Parâmetro 'city' é obrigatório" });
    return;
  }

  try {
    const data = await getWeatherByCity(city);
    res.status(200).json(data);
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    if (error.statusCode === 404) {
      res.status(404).json({ error: "Cidade não encontrada" });
      return;
    }
    console.error("[WEATHER] ERROR:", error.message);
    res.status(500).json({ error: "Erro interno ao consultar dados" });
  }
});

export default router;

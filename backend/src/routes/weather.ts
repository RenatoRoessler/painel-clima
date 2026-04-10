import { Router, Request, Response, NextFunction } from 'express';
import { geocodeCity } from '../services/geocodingService';
import { fetchWeatherByCoords } from '../services/openMeteoService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { city, lat, lon } = req.query;

    if (city) {
      const cityName = String(city).trim();
      if (!cityName) {
        res.status(400).json({ error: 'Parâmetro obrigatório: city ou lat+lon' });
        return;
      }

      const geoResult = await geocodeCity(cityName);
      if (!geoResult) {
        res.status(404).json({ error: 'Cidade não encontrada' });
        return;
      }

      const weatherData = await fetchWeatherByCoords(
        geoResult.latitude,
        geoResult.longitude,
        geoResult.name
      );
      res.status(200).json(weatherData);
      return;
    }

    if (lat !== undefined && lon !== undefined) {
      const latNum = parseFloat(String(lat));
      const lonNum = parseFloat(String(lon));

      if (isNaN(latNum) || isNaN(lonNum)) {
        res.status(400).json({ error: 'Parâmetro obrigatório: city ou lat+lon' });
        return;
      }

      const weatherData = await fetchWeatherByCoords(latNum, lonNum, `${latNum},${lonNum}`);
      res.status(200).json(weatherData);
      return;
    }

    res.status(400).json({ error: 'Parâmetro obrigatório: city ou lat+lon' });
  } catch (err) {
    next(err);
  }
});

export default router;

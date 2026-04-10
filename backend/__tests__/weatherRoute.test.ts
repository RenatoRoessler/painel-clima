import express from "express";
import request from "supertest";
import weatherRouter from "../routes/weather";
import { getWeatherByCity } from "../services/weatherService";

jest.mock("../services/weatherService");
const mockGetWeatherByCity = getWeatherByCity as jest.MockedFunction<typeof getWeatherByCity>;

const app = express();
app.use("/api/weather", weatherRouter);

const mockWeatherData = {
  city: "São Paulo",
  current: {
    temperature_2m: 25,
    relative_humidity_2m: 60,
    wind_speed_10m: 10,
    uv_index: 3,
    precipitation: 0,
    weather_code: 0,
  },
  current_units: { temperature_2m: "°C" },
  hourly: { time: [], temperature_2m: [], precipitation_probability: [] },
  daily: { time: [], temperature_2m_max: [], temperature_2m_min: [], precipitation_sum: [] },
};

describe("GET /api/weather", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 400 quando o parâmetro city está ausente", async () => {
    const res = await request(app).get("/api/weather");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Parâmetro 'city' é obrigatório");
  });

  it("retorna 404 quando a cidade não existe", async () => {
    const err = Object.assign(new Error("Cidade não encontrada"), { statusCode: 404 });
    mockGetWeatherByCity.mockRejectedValueOnce(err);

    const res = await request(app).get("/api/weather?city=CidadeInexistente");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Cidade não encontrada");
  });

  it("retorna 200 com payload correto para cidade válida", async () => {
    mockGetWeatherByCity.mockResolvedValueOnce(mockWeatherData);

    const res = await request(app).get("/api/weather?city=São Paulo");
    expect(res.status).toBe(200);
    expect(res.body.city).toBe("São Paulo");
    expect(res.body.current).toBeDefined();
    expect(res.body.hourly).toBeDefined();
    expect(res.body.daily).toBeDefined();
  });

  it("retorna 500 para exceção inesperada", async () => {
    mockGetWeatherByCity.mockRejectedValueOnce(new Error("Unexpected error"));

    const res = await request(app).get("/api/weather?city=TestCity");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Erro interno ao consultar dados");
  });
});

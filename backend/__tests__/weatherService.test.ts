import { getWeatherByCity } from "../services/weatherService";

const mockForecastData = {
  current: {
    temperature_2m: 25,
    relative_humidity_2m: 60,
    wind_speed_10m: 10,
    uv_index: 3,
    precipitation: 0,
    weather_code: 0,
  },
  current_units: { temperature_2m: "°C" },
  hourly: {
    time: ["2024-01-01T00:00"],
    temperature_2m: [25],
    precipitation_probability: [10],
  },
  daily: {
    time: ["2024-01-01"],
    temperature_2m_max: [28],
    temperature_2m_min: [18],
    precipitation_sum: [0],
  },
};

describe("getWeatherByCity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna dados climáticos para cidade válida", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({
          results: [{ name: "São Paulo", latitude: -23.5, longitude: -46.6, country: "Brazil" }],
        }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        json: async () => mockForecastData,
      } as unknown as Response);

    const result = await getWeatherByCity("São Paulo");

    expect(result.city).toBe("São Paulo");
    expect(result.current.temperature_2m).toBe(25);
    expect(result.hourly).toBeDefined();
    expect(result.daily).toBeDefined();
  });

  it("lança erro 404 para cidade inexistente", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ results: [] }),
    } as unknown as Response);

    await expect(getWeatherByCity("CidadeInexistente999")).rejects.toMatchObject({
      statusCode: 404,
      message: "Cidade não encontrada",
    });
  });

  it("lança erro em caso de falha de rede", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    await expect(getWeatherByCity("São Paulo")).rejects.toThrow("Network error");
  });
});

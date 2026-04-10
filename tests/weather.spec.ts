import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Mock fixture — deterministic data, temp 25°C (laranja-quente gradient)
// ---------------------------------------------------------------------------
const MOCK_WEATHER = {
  city: 'São Paulo',
  current: {
    temperature_2m: 25,
    relative_humidity_2m: 65,
    wind_speed_10m: 12,
    uv_index: 6,
    precipitation: 0,
    weather_code: 1,
  },
  current_units: {
    temperature_2m: '°C',
    wind_speed_10m: 'km/h',
    precipitation: 'mm',
  },
  hourly: {
    time: Array.from({ length: 24 }, (_, i) => {
      const d = new Date();
      d.setHours(d.getHours() + i, 0, 0, 0);
      return d.toISOString().slice(0, 16);
    }),
    temperature_2m: Array.from({ length: 24 }, (_, i) => 20 + (i % 8)),
    precipitation_probability: Array.from({ length: 24 }, (_, i) => i * 3),
  },
  daily: {
    time: ['2026-04-09', '2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13', '2026-04-14', '2026-04-15'],
    temperature_2m_max: [28, 29, 27, 26, 30, 31, 25],
    temperature_2m_min: [18, 19, 17, 16, 20, 21, 15],
    precipitation_sum: [0, 0, 5, 2, 0, 0, 8],
  },
};

const API_PATTERN = '**/api/weather**';

// Helper — aguarda app renderizar após navegação
async function gotoApp(page: import('@playwright/test').Page) {
  await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
  await expect(page.getByPlaceholder(/Digite o nome de uma cidade/i)).toBeVisible({ timeout: 15000 });
}

// ---------------------------------------------------------------------------
// 3.3 — Busca por cidade válida
// ---------------------------------------------------------------------------
test('busca por cidade válida exibe dados climáticos', async ({ page }) => {
  await page.route(API_PATTERN, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_WEATHER) }),
  );

  await gotoApp(page);
  await page.fill('input[type="text"]', 'São Paulo');
  await page.click('button:has-text("Buscar")');

  await expect(page.getByText('São Paulo')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('65%')).toBeVisible(); // umidade do mock
});

// ---------------------------------------------------------------------------
// 3.4 — Skeleton durante carregamento
// ---------------------------------------------------------------------------
test('exibe skeleton (estado de carregamento) enquanto dados chegam', async ({ page }) => {
  await page.route(API_PATTERN, async (route) => {
    await new Promise<void>((r) => setTimeout(r, 3000));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_WEATHER) });
  });

  await gotoApp(page);
  await page.fill('input[type="text"]', 'São Paulo');
  await page.click('button:has-text("Buscar")');

  // During loading: button shows "Buscando..." and is disabled (visible UX feedback)
  await expect(page.getByRole('button', { name: 'Buscando...' })).toBeDisabled({ timeout: 3000 });

  // Weather content is NOT yet visible during loading
  await expect(page.getByText('Próximos 7 dias')).not.toBeVisible();

  // Wait for data to arrive
  await expect(page.getByText('São Paulo')).toBeVisible({ timeout: 10000 });
});

// ---------------------------------------------------------------------------
// 3.5 — Cidade não encontrada
// ---------------------------------------------------------------------------
test('exibe mensagem amigável e botão retry para cidade inexistente', async ({ page }) => {
  await page.route(API_PATTERN, (route) =>
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Cidade não encontrada' }),
    }),
  );

  await gotoApp(page);
  await page.fill('input[type="text"]', 'CidadeInexistente999xyz');
  await page.click('button:has-text("Buscar")');

  await expect(page.getByText('Cidade não encontrada')).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
});

// ---------------------------------------------------------------------------
// 3.6 — Retry após erro de rede
// ---------------------------------------------------------------------------
test('retry após erro de rede restaura dados corretamente', async ({ page }) => {
  let callCount = 0;

  await page.route(API_PATTERN, async (route) => {
    callCount++;
    if (callCount === 1) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Erro interno' }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_WEATHER),
      });
    }
  });

  await gotoApp(page);

  // First search → 500 error
  await page.fill('input[type="text"]', 'São Paulo');
  await page.click('button:has-text("Buscar")');
  await expect(page.getByText('Ops! Algo deu errado')).toBeVisible({ timeout: 10000 });

  // Click retry → returns to idle (search bar visible again)
  await page.click('button:has-text("Tentar novamente")');
  await expect(page.getByPlaceholder(/Digite o nome de uma cidade/i)).toBeVisible();

  // Second search → success (callCount = 2)
  await page.fill('input[type="text"]', 'São Paulo');
  await page.click('button:has-text("Buscar")');
  await expect(page.getByText('São Paulo')).toBeVisible({ timeout: 10000 });
});

// ---------------------------------------------------------------------------
// 3.7 — Background dinâmico
// ---------------------------------------------------------------------------
test('background do painel muda de gradiente após dados carregados', async ({ page }) => {
  await page.route(API_PATTERN, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_WEATHER) }),
  );

  await gotoApp(page);

  // Capture initial background (dark blue default)
  const rootDiv = page.locator('#root > div').first();
  const initialBg = await rootDiv.evaluate((el) => getComputedStyle(el).backgroundImage);

  await page.fill('input[type="text"]', 'São Paulo');
  await page.click('button:has-text("Buscar")');
  await expect(page.getByText('São Paulo')).toBeVisible({ timeout: 10000 });

  // Wait for CSS transition (0.8s) to complete
  await page.waitForTimeout(1200);

  const newBg = await rootDiv.evaluate((el) => getComputedStyle(el).backgroundImage);

  // Background must change (25°C → orange-warm gradient, different from dark-blue initial)
  expect(newBg).not.toBe(initialBg);
  expect(newBg).toContain('gradient');
});

// ---------------------------------------------------------------------------
// 3.8 — Geolocalização mockada
// ---------------------------------------------------------------------------
test('geolocalização mockada carrega dados do local atual', async ({ page }) => {
  // Mock navigator.geolocation before page load
  await page.addInitScript(() => {
    const mockPosition = {
      coords: {
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (success: (pos: typeof mockPosition) => void) => {
          setTimeout(() => success(mockPosition), 100);
        },
      },
      configurable: true,
      writable: false,
    });
  });

  await page.route(API_PATTERN, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...MOCK_WEATHER, city: 'São Paulo' }),
    }),
  );

  await gotoApp(page);
  await page.click('[title="Usar minha localização"]');

  await expect(page.getByText('São Paulo')).toBeVisible({ timeout: 10000 });
});

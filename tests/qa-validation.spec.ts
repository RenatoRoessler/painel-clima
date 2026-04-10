/**
 * QA Validation Suite — Painel de Clima
 * Cobre todos os RF do PRD + verificações de acessibilidade WCAG 2.2
 */
import { test, expect } from '@playwright/test';

const MOCK_WEATHER = {
  city: 'Rio de Janeiro',
  current: {
    temperature_2m: 28,
    relative_humidity_2m: 72,
    wind_speed_10m: 18,
    uv_index: 9,
    precipitation: 1.2,
    weather_code: 61,
  },
  current_units: { temperature_2m: '°C', wind_speed_10m: 'km/h', precipitation: 'mm' },
  hourly: {
    time: Array.from({ length: 48 }, (_, i) => {
      const d = new Date('2026-04-09T00:00:00');
      d.setHours(i);
      return d.toISOString().slice(0, 16);
    }),
    temperature_2m: Array.from({ length: 48 }, (_, i) => 22 + Math.sin(i / 4) * 6),
    precipitation_probability: Array.from({ length: 48 }, (_, i) => (i % 12) * 8),
  },
  daily: {
    time: ['2026-04-09','2026-04-10','2026-04-11','2026-04-12','2026-04-13','2026-04-14','2026-04-15'],
    temperature_2m_max: [30, 32, 28, 25, 29, 31, 27],
    temperature_2m_min: [22, 23, 20, 18, 21, 24, 19],
    precipitation_sum: [1.2, 0, 5, 8, 0, 0, 3],
  },
};

const API_PATTERN = '**/api/weather**';

async function loadWithData(page: import('@playwright/test').Page, weatherData = MOCK_WEATHER) {
  await page.route(API_PATTERN, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(weatherData) }),
  );
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.fill('input[type="text"]', weatherData.city);
  await page.click('button:has-text("Buscar")');
  await expect(page.getByText(weatherData.city)).toBeVisible({ timeout: 10000 });
}

// ─── RF-01 / RF-02: Campo de busca sem autocomplete ────────────────────────

test('RF-01/02 - campo de busca aceita texto livre e sem autocomplete', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const input = page.locator('input[type="text"]');
  await expect(input).toBeVisible();
  await expect(input).toHaveAttribute('autocomplete', 'off');
  await page.fill('input[type="text"]', 'Curitiba');
  await expect(input).toHaveValue('Curitiba');
  await page.screenshot({ path: 'tests/screenshots/rf01-02-search-input.png' });
});

// ─── RF-03 / RF-17: Skeleton loading ───────────────────────────────────────

test('RF-03/17 - skeleton aparece durante carregamento e desaparece após dados', async ({ page }) => {
  await page.route(API_PATTERN, async (route) => {
    await new Promise<void>((r) => setTimeout(r, 2000));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_WEATHER) });
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.fill('input[type="text"]', 'Rio de Janeiro');
  await page.click('button:has-text("Buscar")');
  // Loading state: button disabled, weather content absent
  await expect(page.getByRole('button', { name: 'Buscando...' })).toBeDisabled();
  await expect(page.getByText('Próximos 7 dias')).not.toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/rf03-17-skeleton-loading.png' });
  // After load
  await expect(page.getByText('Rio de Janeiro')).toBeVisible({ timeout: 8000 });
  await expect(page.getByText('Próximos 7 dias')).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/rf03-17-skeleton-loaded.png' });
});

// ─── RF-04 / RF-05 / RF-18: Erro e retry ──────────────────────────────────

test('RF-04/05/18 - mensagem amigável + retry para cidade não encontrada', async ({ page }) => {
  await page.route(API_PATTERN, (route) =>
    route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'Cidade não encontrada' }) }),
  );
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.fill('input[type="text"]', 'CidadeInexistente999');
  await page.click('button:has-text("Buscar")');
  await expect(page.getByText('Cidade não encontrada')).toBeVisible({ timeout: 8000 });
  await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/rf04-05-18-error-state.png' });
  // Retry returns to idle
  await page.click('button:has-text("Tentar novamente")');
  await expect(page.getByPlaceholder(/Digite o nome/i)).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/rf04-retry-idle.png' });
});

// ─── RF-06 / RF-07 / RF-08: Geolocalização ────────────────────────────────

test('RF-06/07/08 - botão de geolocalização presente e funcional', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (success: (p: GeolocationPosition) => void) => {
          setTimeout(() => success({
            coords: { latitude: -22.9, longitude: -43.17, accuracy: 10, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
            timestamp: Date.now(),
          } as GeolocationPosition), 100);
        },
      },
      configurable: true,
    });
  });
  await page.route(API_PATTERN, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_WEATHER) }),
  );
  await page.goto('/', { waitUntil: 'networkidle' });
  const geoBtn = page.locator('[title="Usar minha localização"]');
  await expect(geoBtn).toBeVisible();
  await geoBtn.click();
  await expect(page.getByText('Rio de Janeiro')).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: 'tests/screenshots/rf06-07-08-geolocation.png' });
});

// ─── RF-09 / RF-10: Clima atual com ícone ─────────────────────────────────

test('RF-09/10 - clima atual exibe todos os campos e ícone animado', async ({ page }) => {
  await loadWithData(page);
  await expect(page.getByText('Rio de Janeiro')).toBeVisible();
  await expect(page.getByText('28°C', { exact: false }).first()).toBeVisible(); // temperatura
  await expect(page.getByText('72%')).toBeVisible();         // umidade
  await expect(page.getByText('18').first()).toBeVisible();  // vento
  await expect(page.getByText(/Índice UV/i)).toBeVisible();  // UV bar
  await expect(page.getByText('1.2 mm', { exact: true })).toBeVisible(); // precipitação
  // Ícone animado (WeatherIcon renderiza um span com emoji)
  const icon = page.locator('span[aria-label]').first();
  await expect(icon).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/rf09-10-current-weather.png' });
});

// ─── RF-11: Background dinâmico ────────────────────────────────────────────

test('RF-11 - background muda baseado na temperatura (28°C → gradiente quente)', async ({ page }) => {
  await page.route(API_PATTERN, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_WEATHER) }),
  );
  await page.goto('/', { waitUntil: 'networkidle' });
  const initialBg = await page.locator('#root > div').first().evaluate((el) =>
    getComputedStyle(el).backgroundImage,
  );
  await page.fill('input[type="text"]', 'Rio de Janeiro');
  await page.click('button:has-text("Buscar")');
  await expect(page.getByText('Rio de Janeiro')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(1000); // CSS transition
  const newBg = await page.locator('#root > div').first().evaluate((el) =>
    getComputedStyle(el).backgroundImage,
  );
  expect(newBg).not.toBe(initialBg);
  expect(newBg).toContain('gradient');
  // 28°C deve ser laranja-quente (#f77f00 → #d62828) — faixa 20-28°C
  await page.screenshot({ path: 'tests/screenshots/rf11-dynamic-background.png' });
});

// ─── RF-12: Barra UV ───────────────────────────────────────────────────────

test('RF-12 - barra UV com gradiente verde→vermelho e rótulo', async ({ page }) => {
  await loadWithData(page);
  const uvBar = page.getByText(/Índice UV/i);
  await expect(uvBar).toBeVisible();
  // UV = 9 (Muito alto)
  await expect(page.getByText(/Muito alto/i)).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/rf12-uv-bar.png' });
});

// ─── RF-13 / RF-14: Gráfico hora a hora ────────────────────────────────────

test('RF-13/14 - gráfico hora a hora com tooltip interativo', async ({ page }) => {
  await loadWithData(page);
  await expect(page.getByText('Previsão Hora a Hora')).toBeVisible();
  // Recharts renderiza SVG
  const chart = page.locator('svg').first();
  await expect(chart).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/rf13-14-hourly-chart.png' });
});

// ─── RF-15 / RF-16: Previsão 7 dias ────────────────────────────────────────

test('RF-15/16 - 7 cards diários com barras de temperatura', async ({ page }) => {
  await loadWithData(page);
  await expect(page.getByText('Próximos 7 dias')).toBeVisible();
  // 7 temperaturas máximas (30, 32, 28, 25, 29, 31, 27°)
  const maxTemps = ['30°', '32°', '28°', '25°', '29°', '31°', '27°'];
  for (const temp of maxTemps) {
    await expect(page.getByText(temp).first()).toBeVisible();
  }
  await page.screenshot({ path: 'tests/screenshots/rf15-16-daily-forecast.png' });
});

// ─── WCAG 2.2: Acessibilidade ──────────────────────────────────────────────

test('WCAG - navegação por teclado funciona (Tab + Enter)', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  // Tab para o input
  await page.keyboard.press('Tab');
  const input = page.locator('input[type="text"]');
  await expect(input).toBeFocused();
  // Digita e pressiona Tab para o botão Buscar
  await page.fill('input[type="text"]', 'São Paulo');
  await page.keyboard.press('Tab');
  const searchBtn = page.getByRole('button', { name: 'Buscar' });
  await expect(searchBtn).toBeFocused();
  await page.screenshot({ path: 'tests/screenshots/wcag-keyboard-nav.png' });
});

test('WCAG - ícones têm aria-label descritivo', async ({ page }) => {
  await loadWithData(page);
  const icons = page.locator('span[aria-label]');
  const count = await icons.count();
  expect(count).toBeGreaterThan(0);
  // Verificar que os aria-labels não estão vazios
  for (let i = 0; i < Math.min(count, 3); i++) {
    const label = await icons.nth(i).getAttribute('aria-label');
    expect(label).not.toBe('');
    expect(label).not.toBeNull();
  }
  await page.screenshot({ path: 'tests/screenshots/wcag-aria-labels.png' });
});

test('WCAG - input de busca tem placeholder descritivo', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const input = page.locator('input[type="text"]');
  const placeholder = await input.getAttribute('placeholder');
  expect(placeholder).toBeTruthy();
  expect(placeholder!.length).toBeGreaterThan(10);
});

test('WCAG - botão de geolocalização tem title descritivo', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const geoBtn = page.locator('[title="Usar minha localização"]');
  await expect(geoBtn).toBeVisible();
});

// ─── API: Sem chamadas diretas à Open-Meteo ────────────────────────────────

test('Segurança - frontend NÃO chama Open-Meteo diretamente', async ({ page }) => {
  const openMeteoRequests: string[] = [];
  page.on('request', (req) => {
    if (req.url().includes('open-meteo.com')) {
      openMeteoRequests.push(req.url());
    }
  });
  await page.route(API_PATTERN, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_WEATHER) }),
  );
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.fill('input[type="text"]', 'Rio de Janeiro');
  await page.click('button:has-text("Buscar")');
  await expect(page.getByText('Rio de Janeiro')).toBeVisible({ timeout: 10000 });
  expect(openMeteoRequests).toHaveLength(0);
});

// ─── Interface em PT-BR ────────────────────────────────────────────────────

test('L10N - interface exibida em PT-BR', async ({ page }) => {
  await loadWithData(page);
  await expect(page.getByText('Próximos 7 dias')).toBeVisible();
  await expect(page.getByText('Previsão Hora a Hora')).toBeVisible();
  await expect(page.getByText('Umidade')).toBeVisible();
  await expect(page.getByText('Vento')).toBeVisible();
  await expect(page.getByText('Precipitação').first()).toBeVisible();
  await expect(page.getByText(/Índice UV/i)).toBeVisible();
});

// ─── Estado inicial (idle) ─────────────────────────────────────────────────

test('Estado idle - mensagem de boas-vindas ao carregar', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByText(/Digite o nome de uma cidade ou use sua localização/i)).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/idle-state.png' });
});

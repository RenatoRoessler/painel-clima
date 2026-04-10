import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm --prefix ./backend run start',
      port: 3000,
      reuseExistingServer: true,
      timeout: 20000,
    },
    {
      command: 'npm --prefix ./frontend run build && npm --prefix ./frontend run preview -- --port 5173',
      port: 5173,
      reuseExistingServer: true,
      timeout: 60000,
    },
  ],
});

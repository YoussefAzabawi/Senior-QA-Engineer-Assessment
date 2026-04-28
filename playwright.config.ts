import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: false,
  retries: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["allure-playwright", { outputFolder: "allure-results" }]
  ],
  use: {
    baseURL: process.env.BASE_URL ?? "https://demowebshop.tricentis.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});

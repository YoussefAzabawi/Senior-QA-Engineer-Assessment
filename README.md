# Playwright TS Automation - Demo Web Shop

This project is a professional, data-driven Playwright TypeScript automation framework that validates a complete checkout flow using Page Object Model (POM), external test data, and reporting.

## Implemented Scenario

- Place order with multiple products on `https://demowebshop.tricentis.com`
- Validate line item calculations (`unit price x quantity = line total`)
- Validate cart subtotal against item totals
- Validate final order total (`subtotal + shipping + tax = total`)

## Tech Stack

- Playwright + TypeScript
- POM architecture
- Externalized data via JSON
- Reports:
  - Playwright HTML report
  - Allure report

## Project Structure

- `tests/` - test specs
- `pages/` - page objects
- `utils/` - data and price validation helpers
- `data/` - external JSON test data
- `docs/` - supplemental documentation

## Prerequisites

- Node.js 18+
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Create environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

4. Update `.env` values.

## Required Environment Variables

- `BASE_URL` (default: `https://demowebshop.tricentis.com`)
- `DEMO_USER_EMAIL` - existing Demo Web Shop account email
- `DEMO_USER_PASSWORD` - existing Demo Web Shop account password

Do not commit `.env` or any real credentials.

## Test Data

Edit `data/order-data.json` to control products, quantities, and checkout details.

## Run Tests

Run all tests:

```bash
npm test
```

Run in headed mode:

```bash
npm run test:headed
```

Run in debug mode:

```bash
npm run test:debug
```

## Reports

Open Playwright HTML report:

```bash
npm run report:html
```

Generate Allure report:

```bash
npm run allure:generate
```

Open Allure report:

```bash
npm run allure:open
```

## GitHub Delivery Steps

1. Initialize git repository (if not initialized):

```bash
git init
```

2. Commit project:

```bash
git add .
git commit -m "Add Playwright TS POM automation for multi-product checkout"
```

3. Create GitHub repository and push:

```bash
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

4. Share repository URL as deliverable.

## Security Notes

- Keep secrets only in environment variables.
- Never hardcode credentials or tokens in source code.
- `.env` is ignored via `.gitignore`.

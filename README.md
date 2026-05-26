# FinWise Personal Finance Tracker

A modern React + Vite personal finance tracker with localStorage persistence, reusable components, starter data, and a scalable architecture prepared for charts, authentication, budgets, recurring payments, and API sync.

## Scripts

```bash
npm install
npm run dev
npm run build
```

Development server: `http://localhost:5173/`

## Structure

```txt
src/
  app/                  App composition
  components/           Reusable layout, summary, transaction, and UI components
  data/                 Categories and starter transaction data
  hooks/                Stateful feature hooks
  pages/                Dashboard/page-level views
  services/             Persistence boundary; localStorage today, API later
  styles/               Global design tokens and base styles
  utils/                Formatting and financial calculations
```

# Digital Menu — mobile app

A restaurant digital menu for iPhone, Android and the web, built with **Expo (React Native) + TypeScript**.
Guests browse the menu, save favourites, build an order to show the waiter, call the waiter and scan their table's QR code — in **English and Arabic (RTL)**, with **light and dark** themes.

## Features

- Home with Chef's pick banner and category grid; Menu, Favourites and Info tabs
- Category dish lists with sub-category chips, dish details with ingredients and allergen warnings
- My Order: quantities, kitchen notes, totals and a large "show to waiter" view (no payment in the app)
- Filters: diet, avoided allergens (saved), spice level, price range, sort
- Call waiter requests, table QR scanning (`expo-camera`) and `digitalmenu://table/<n>` deep links
- Search across names, descriptions and ingredients, Arabic-aware (ignores tashkeel and hamza forms)
- Login, Register and Forgot password screens
- Appearance: Light / Dark / System

## Getting started

Requires **Node.js 22.13+** (or 24 LTS).

```bash
npm install
cp .env.example .env   # then set your API address and company id
npx expo start
```

Open the app with **Expo Go** on your phone (scan the QR code, phone and computer on the same Wi-Fi), or press `w` for the web version.

## Configuration

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | bomain API base URL. On a phone use your computer's LAN IP, not `localhost`. |
| `EXPO_PUBLIC_COMPANY_ID` | Restaurant id (`cp_id`) in the backend. |

## Project structure

```
src/
  app/          screens (Expo Router — each file is a route)
  components/   ui/, menu/, order/, home/, layout/
  theme/        colour tokens (light/dark), fonts (Latin + Arabic), spacing
  api/          API client and endpoints
  hooks/        TanStack Query hooks, RTL helpers
  store/        Zustand stores (settings, order, favourites, filters, auth, search)
  i18n/         en.json, ar.json
  data/         sample menu and restaurant data (used until the API is connected)
  utils/        filtering, search, opening hours, validation, QR parsing
```

## Status

- Menu content currently comes from **sample data** in `src/data/` until the API is connected.
- **Waiter requests** and **accounts** (sign in / sign up / reset) are **simulated** in `src/api/waiter.ts` and `src/api/auth.ts` until the backend has endpoints for them.

## Scripts

```bash
npx expo start                  # dev server
npx tsc --noEmit                # type-check
npx eslint src                  # lint
npx expo export --platform web  # static web build in dist/
```

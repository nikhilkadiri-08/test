# TerraSense

AI-powered soil quality monitoring dashboard. Input sensor readings (pH, NPK, moisture, organic matter, temperature) and get real-time predictions on soil health, expected crop yield, fertility duration, and actionable recommendations.

## Quick Start

```bash
cd soilsense/frontend
npm install
npm run dev
```

Open **http://localhost:5174**

## Features

- **Soil Health Index** — composite score from multi-sensor fusion
- **Expected Outcome** — AI yield forecast (Poor → Excellent)
- **Fertility Window** — estimated months/years of productive soil life
- **Crop Suitability** — match scores for common crops
- **Recommendations** — targeted interventions based on deficiencies

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS with glassmorphism UI
- Framer Motion animations
- Client-side AI analysis engine (no API keys required)

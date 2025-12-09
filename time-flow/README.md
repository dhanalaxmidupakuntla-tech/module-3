# TimeFlow — AI-Powered Daily Time Tracking (React)

## Structure
- `src/components` — reusable UI components (ActivityForm, ActivityList, Analytics)
- `src/pages` — pages (Login, Tracker, Dashboard)
- `src/lib` — firebase + storage + auth helpers
- `src/App.jsx`, `src/main.jsx`, `index.html`

## Quick start
1. Save files into a folder.
2. Run:
   ```
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173`

## Firebase
- To use Firestore & Auth: paste the Firebase config into `window.FIREBASE_CONFIG` (e.g. in your `index.html` before module load or in dev console).
- The app will fall back to localStorage demo mode if no config is provided.

## Notes
- Daily limit enforcement (1440 minutes) is implemented in UI logic.
- Analyse/dashboard shows pie and bar visualizations using Chart.js.

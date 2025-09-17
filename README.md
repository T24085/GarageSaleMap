# Garage Sales Map

A React + Firebase web app for crowdsourcing garage sales and showing them on an interactive MapLibre map.

## Tech Stack
- Vite + React 18
- Firebase (Auth, Firestore, Functions, Storage)
- MapLibre GL with MapTiler tiles
- Cloud Functions (Node.js 20) for geocoding + scheduled status updates

## Getting Started

### Prerequisites
- Node.js 20+ (local dev works on newer, deployment targets Node 20)
- Firebase CLI `npm install -g firebase-tools`
- A Firebase project with Firestore, Authentication (Google sign-in), Storage, and Cloud Functions enabled
- MapTiler account for tiles and geocoding (free tier is sufficient)

### Installation
```bash
npm install
cp .env.example .env
# Fill in the Firebase web config and MapTiler key in .env
npm run dev
```
The dev server runs on `http://localhost:5173` by default.

### Environment Variables (`.env`)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE=
VITE_FIREBASE_MSG_SENDER=
VITE_FIREBASE_APP_ID=
VITE_MAPTILER_KEY=
```

For Cloud Functions, configure the MapTiler key via Firebase runtime config:
```bash
firebase functions:config:set maptiler.key="YOUR_MAPTILER_KEY"
```
Or, when using service account JSON deployment, expose `MAPTILER_KEY` inside your workflow/secrets.

### Available Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — preview production build
- `npm run lint` — run ESLint across the project

## Firebase
- Firestore rules stored in `firestore.rules`
- Storage rules stored in `storage.rules`
- Cloud Functions source in `functions/index.js`
- Hosting deploys `dist/` and rewrites all routes to `index.html`

Run emulators (optional):
```bash
firebase emulators:start
```

## Cloud Functions Summary
- `onSaleCreate` geocodes new sales via MapTiler (with caching in `geocache/`) and writes `loc` + `geohash`
- `updateStatuses` runs every 15 minutes to transition sales between `upcoming`, `live`, and `ended`

## CI/CD
GitHub Actions workflow (`.github/workflows/deploy.yml`):
- Pull requests deploy to a temporary Firebase Hosting preview channel
- Merges to `main` deploy Hosting, Functions, Firestore rules, and Storage rules

Add these GitHub secrets:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT` (JSON string for a service account with Firebase Admin + Hosting Admin + Functions Admin roles)

## Project Structure
```
.
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   └── lib/
├── functions/
│   ├── index.js
│   └── package.json
├── firestore.rules
├── storage.rules
├── firebase.json
├── .firebaserc
├── .env.example
└── .github/workflows/deploy.yml
```

## Roadmap
See [`PROJECT_PLAN.md`](PROJECT_PLAN.md) for milestones, backlog, and cost/safety guidance.
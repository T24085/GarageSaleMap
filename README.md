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
- A Firebase project with Firestore, Authentication (Email/Password enabled), Storage, and Cloud Functions
- MapTiler account for tiles and geocoding (free tier is sufficient)

### Installation
```bash
npm install
cp .env.example .env
# Fill in the Firebase web config, MapTiler key, and base path in .env
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
VITE_BASE_PATH=/
```
- Leave `VITE_BASE_PATH=/` for Firebase/local.
- When building for GitHub Pages set `VITE_BASE_PATH=/GarageSaleMap/` (or the repo name).
- If you skip `VITE_FIREBASE_STORAGE`, the default `${VITE_FIREBASE_PROJECT_ID}.firebasestorage.app` is used.

### Firebase Configuration Checklist
- Authentication → Sign-in method: enable **Email/Password**. (Optional: add Google later.)
- Authentication → Settings → Authorized domains: add `localhost` and `t24085.github.io` (or your custom domains).
- Firestore rules defined in `firestore.rules`.
- Cloud Functions: configure the MapTiler key for geocoding.
  ```bash
  firebase functions:config:set maptiler.key="YOUR_MAPTILER_KEY"
  ```

### Available Scripts
- `npm run dev` - start Vite dev server
- `npm run build` - production build (outputs to `dist/`)
- `npm run preview` - preview production build
- `npm run lint` - run ESLint across the project

Posting a sale requires signing in. The header auth widget lets people register or sign in with email/password; once authenticated they can submit the sale form.

## Firebase
- Firestore rules stored in `firestore.rules`
- Storage rules stored in `storage.rules`
- Cloud Functions source in `functions/index.js`
- Hosting deploys `dist/` and rewrites all routes to `index.html`

Run emulators (optional):
```bash
firebase emulators:start
```

## GitHub Pages Preview
Workflow `.github/workflows/pages.yml` builds the app with `VITE_BASE_PATH=/GarageSaleMap/` and publishes `dist/` to GitHub Pages. Enable Pages in repo settings with "GitHub Actions" as the source and set repository secrets for the Firebase config (see CI/CD below). If you omit `VITE_FIREBASE_STORAGE`, the workflow derives `${VITE_FIREBASE_PROJECT_ID}.firebasestorage.app` automatically.

## Cloud Functions Summary
- `onSaleCreate` geocodes new sales via MapTiler (with caching in `geocache/`) and writes `loc` + `geohash`
- `updateStatuses` runs every 15 minutes to transition sales between `upcoming`, `live`, and `ended`

## CI/CD
GitHub Actions workflows:
- `.github/workflows/deploy.yml` - Firebase Hosting/Functions deploy (PR previews + main)
- `.github/workflows/pages.yml` - GitHub Pages static preview build

Add these GitHub secrets:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_MSG_SENDER`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_STORAGE` *(optional – defaults to `${VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`)*
- `VITE_MAPTILER_KEY` (optional for tiles)

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
├── .github/workflows/
│   ├── deploy.yml
│   └── pages.yml
└── PROJECT_PLAN.md
```

## Roadmap
See [`PROJECT_PLAN.md`](PROJECT_PLAN.md) for milestones, backlog, and cost/safety guidance.
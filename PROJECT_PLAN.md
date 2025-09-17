# Garage Sales Map — Delivery Plan

## 0. MVP Summary
Firebase-backed map app where users post garage sales, shoppers browse/filter on a map, and get driving directions. Stack: React (Vite), MapLibre (MapTiler tiles), Firebase (Auth, Firestore, Functions, Storage). Deploy via GitHub → Firebase Hosting.

## 1. Repo & Environments
- `npm install`
- `cp .env.example .env`
- Populate Firebase web config + MapTiler key
- `npm run dev`

### Structure
```
/ (root)
├── README.md
├── PROJECT_PLAN.md
├── package.json
├── vite.config.js
├── index.html
├── manifest.webmanifest
├── src/
│   ├── main.jsx
│   ├── App.jsx
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

## 2. Firebase Setup
1. Create project
2. Enable Google sign-in (Auth), Firestore, Storage, Functions
3. Enable Cloud Scheduler API for cron
4. CLI setup: `npm i -g firebase-tools`, `firebase login`, `firebase use <PROJECT_ID>`

## 3. Firestore Data Model
Collection `sales/{saleId}`
```json
{
  "title": "string",
  "description": "string",
  "address": "string",
  "loc": { "lat": number, "lng": number },
  "geohash": "string",
  "startsAt": "Timestamp",
  "endsAt": "Timestamp",
  "status": "upcoming|live|ended",
  "categories": ["string"],
  "photos": ["string"],
  "approxUntilLive": boolean,
  "ownerUid": "string|null",
  "createdAt": "Timestamp"
}
```
Optional later: `flags/{flagId}`, `geocache/{hash}`.

## 4. Security Rules (MVP)
See `firestore.rules` and `storage.rules` for current policies (public read, authenticated create/update with ownership checks).

## 5. Cloud Functions (Node 20)
- `onSaleCreate`: geocode new sales via MapTiler, write `loc` + `geohash`, cache results
- `updateStatuses`: scheduled every 15 minutes, batches updates to switch `status`

## 6. Frontend (React + Vite + MapLibre)
- `App.jsx` hosts header, filters, form placeholder, map pane
- `Map.jsx` initializes MapLibre with MapTiler tiles, renders markers, popups with directions link
- Filters: Today, This Weekend, All Upcoming (v1.1 adds more)
- Sales list uses `SaleCard` component
- Future: geohash radius queries, clustering, photo uploads

## 7. Geocoding Provider
- MapTiler Geocoding API (free tier)
- Fallback to cache in `geocache/`
- Store `MAPTILER_KEY` in Firebase functions config or GitHub secret

## 8. CI/CD
GitHub Actions workflow (`deploy.yml`)
- PRs → Firebase Hosting preview channel (`firebase hosting:channel:deploy`)
- Main → Firebase Hosting + Functions + Rules deploy
- Required secrets: `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT`

## 9. Milestones
- **A — Map + Submit (2–3 days)**: Map loads, signed-in create, Firestore persistence, marker popups
- **B — Auto-Status + Geocoding (1–2 days)**: Functions geocode + status update, timezone fixes
- **C — Filters + Privacy (1–2 days)**: Quick filters, privacy offset pin, hide ended by default
- **D — Clustering + Polish (1–2 days)**: Marker clustering, SEO+PWA refinements

## 10. Backlog (v1.1+)
Photos upload/resizing, favorites, moderation, CSV import, email digests, reCAPTCHA, rate limiting.

## 11. Cost Control
- MapTiler free tier + caching
- Resize uploads
- Query Firestore with selective filters + future geohash bounds
- Scheduler every 15 minutes

## 12. Privacy & Safety
- `approxUntilLive` offsets pin until sale goes live
- Display city/block pre-start
- Rate limit UI creates; add reCAPTCHA later

## 13. QA Checklist
Functional CRUD, auth gating, directions link accuracy, status transitions.
Map stability + timezone accuracy.
Security rules validated.
CI/CD preview + production verified.

## 14. Commands
- Dev: `npm run dev`
- Emulators: `firebase emulators:start`
- Manual deploy: `npm run build` then `firebase deploy --only hosting,functions,firestore:rules,storage:rules`

## 15. Definition of Done (MVP)
- Responsive map experience
- Authenticated sale creation with server-side geocoding
- Status automation
- CI/CD pipeline live
- README + env example maintained
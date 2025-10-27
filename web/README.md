# SimTak Web Client

React + Mapbox GL application that connects to the SimTak realtime API.

## Setup

```bash
npm install
npm run dev
```

Create a `.env` file with:

```
VITE_SERVER_URL=http://localhost:4000
VITE_MAPBOX_TOKEN=your-token
```

## Features

* Connects to the Socket.IO server once authenticated.
* Displays live player positions on a Mapbox map.
* Provides starter WebRTC voice scaffolding using `simple-peer`.

The implementation is intentionally minimal; extend it with squad lists, annotation layers, and production-grade voice UX.

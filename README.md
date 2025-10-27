# SimTak

SimTak is a tactical coordination platform designed for milsim and airsoft teams. The project ships as a multi-client, real-time system with native iOS and web applications backed by a Node.js realtime API. This repository now hosts a clean starter layout that replaces the previous Garage Sale Map codebase.

## Repository layout

```
.
├── docs/               # Architecture and planning documents
├── ios/                # Swift source skeleton for the native client
├── server/             # Node.js realtime API (Express + Socket.IO)
└── web/                # React web client with Mapbox GL and WebRTC helpers
```

## Getting started

Each sub-project maintains its own README with detailed setup steps. In short:

1. Configure environment variables (see `server/.env.example`).
2. Install dependencies in `server/` and `web/` with your preferred Node.js version (18+ recommended).
3. Follow the iOS README for building the Swift package in Xcode and linking the GoogleWebRTC binary via Swift Package Manager or CocoaPods.
4. Start the server (`npm run dev` from `server/`) and point the clients at the server URL.

## Key capabilities

* Real-time squad location sharing over Socket.IO channels.
* Collaborative map annotations (markers, polylines, polygons) persisted in MongoDB.
* Squad chat and optional WebRTC voice signaling routed through the server.
* Extensible data model defined in `docs/DATA_MODEL.md`.
* Security-first posture with JWT authentication, TLS-only assumptions, and rate limiting hooks.

## Next steps

The current snapshot focuses on scaffolding. Implementation work that naturally follows includes:

* Filling in persistence logic for the Express routes and Socket.IO handlers.
* Integrating an SFU (e.g., mediasoup) when scaling beyond peer-to-peer voice meshes.
* Building polished UI flows for login, squad management, and tactical overlays.
* Instrumentation, testing, and deployment automation specific to your infrastructure.

Contributions and refinements are welcome—see `docs/ROADMAP.md` for suggested milestones.

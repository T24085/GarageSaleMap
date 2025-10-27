# SimTak Architecture Overview

SimTak is composed of three primary components that communicate over secure WebSocket and HTTPS channels.

## Mobile client (iOS)

* Written in Swift with SwiftUI for UI composition and MapKit for geospatial rendering.
* Uses CoreLocation to sample GPS data at a configurable rate and pushes updates through Socket.IO.
* Integrates Google WebRTC or a hosted SDK (Twilio, Agora) for secure voice communications between squad members.
* Maintains local caches of annotations and player state for offline resiliency.

## Web client (React)

* Uses Vite for development tooling, React for the UI, and Mapbox GL JS for map rendering.
* Maintains a synchronized squad view by subscribing to Socket.IO events exposed by the backend.
* Implements WebRTC using the browser APIs and `simple-peer` as a thin wrapper for cross-browser negotiation.

## Realtime backend (Node.js)

* Express-based REST API for authentication, match management, and annotation persistence.
* Socket.IO handles bidirectional event streams for player telemetry, map changes, chat, and WebRTC signaling.
* MongoDB stores users, games, squads, and annotations. Swappable with PostgreSQL if a relational schema is desired.
* Provides hooks for rate limiting, auditing, and bridging to an SFU such as mediasoup or Janus for scalable voice.

## Deployment considerations

* Containerized services for the server and web client enable deployment to Kubernetes, ECS, or simple VPS setups.
* TLS termination is required for both REST and WebSocket traffic; Let's Encrypt certificates can be automated.
* APNs (iOS) and Web Push integrations can be added for out-of-band alerts such as invite notifications.

Refer to `docs/REALTIME_EVENTS.md` and `docs/DATA_MODEL.md` for detailed protocol and schema definitions.

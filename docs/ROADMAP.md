# Roadmap

## Milestone 1 — Core scaffolding
* ✅ Replace Garage Sale Map code with SimTak skeleton.
* Set up CI workflows for linting and testing.
* Implement environment configuration for server and clients.

## Milestone 2 — Authentication & persistence
* Build full auth flows (registration, login, refresh tokens).
* Persist squads, games, and annotations in MongoDB.
* Introduce RBAC for commanders, squad leads, and players.

## Milestone 3 — Realtime collaboration
* Finalize location streaming with throttling and smoothing.
* Complete annotation CRUD, undo/redo, and history replay.
* Ship squad chat with moderation tooling.

## Milestone 4 — Voice communications
* Deliver peer-to-peer WebRTC voice for small squads.
* Integrate an SFU option (mediasoup/Janus) for large matches.
* Provide in-app voice UX (mute, push-to-talk, channel switching).

## Milestone 5 — Operational readiness
* Add observability (logging, metrics, tracing).
* Automate deployments for server and web clients.
* Add end-to-end tests that cover multi-client flows.

Milestones may be revisited as product requirements evolve.

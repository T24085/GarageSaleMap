# SimTak Server

Node.js + Express + Socket.IO backend that powers the SimTak clients.

## Requirements

* Node.js 18+
* MongoDB 6+

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

The server starts on the port defined in `.env` (default `4000`).

## Available endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/auth/login` | Exchange credentials for a JWT |
| `GET` | `/games` | List games the user can join |
| `POST` | `/games` | Create a game |
| `GET` | `/games/:id/annotations` | Fetch annotations |
| `POST` | `/games/:id/annotations` | Create an annotation |

Socket.IO events are detailed in `docs/REALTIME_EVENTS.md`.

## Development notes

* Persisted models live under `src/models`.
* Socket handlers are defined in `src/socket/handlers.js`.
* Replace the placeholder authentication logic before production use.

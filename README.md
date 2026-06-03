# TaskFlow — Multica Next.js Demo

TODO application built on Next.js 15 (App Router) + TypeScript (strict) + Tailwind v4 + MongoDB.

Project board: VAN-6 (parent), see issues for delivery tracks.

Setup, env vars, Docker, and CI are owned by the scaffold track (see issue VAN-8).
DB layer (Mongoose models, indexes, connection helper, aggregations) is owned by VAN-7.

## Stack

- **Next.js 15** App Router (`src/app/`), React 19, `output: "standalone"` for slim Docker images
- **TypeScript** strict mode, path alias `@/* → src/*`
- **Tailwind CSS v4** (`@tailwindcss/postcss`)
- **MongoDB 7** via `docker-compose`
- **GitHub Actions** CI: lint, typecheck, build

## Quickstart

### Prerequisites

- Node.js 20+
- npm 10+
- Docker + Docker Compose (for the containerized flow)

### Local dev (host Node, host Mongo)

```bash
cp .env.example .env.local
# Edit .env.local: point MONGODB_URI at a running Mongo
# Generate strong secrets:  openssl rand -base64 32
npm install
npm run dev
```

App: <http://localhost:3000>
Health: <http://localhost:3000/api/health>

### Containerized (app + Mongo, the supported one-shot path)

```bash
cp .env.example .env
# Edit .env: set real JWT_SECRET / NEXTAUTH_SECRET (openssl rand -base64 32).
docker compose up --build
```

App: <http://localhost:3000>. Mongo runs inside the compose network at `mongodb://mongo:27017/multica_todo`. To reach it from the host (e.g. Compass / `mongosh`), uncomment the `ports` block under `mongo` in `docker-compose.yml`.

Stop & wipe data:

```bash
docker compose down -v
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | yes | Mongo connection string. In docker-compose use `mongodb://mongo:27017/multica_todo`. |
| `JWT_SECRET` | yes | Secret for signing JWT access tokens. |
| `NEXTAUTH_SECRET` | yes | Secret for NextAuth / session cookies. |
| `NEXTAUTH_URL` | yes | Public base URL of the app (e.g. `http://localhost:3000`). |

Generate strong secrets:

```bash
openssl rand -base64 32
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build (standalone output) |
| `npm run start` | Run production build |
| `npm run lint` | ESLint via `next lint` |
| `npm run typecheck` | `tsc --noEmit` |

## Health check

`GET /api/health` returns `{ status: "ok", uptime, timestamp }`. Used by Docker `HEALTHCHECK` and the docker-compose service health probe.

## CI

`.github/workflows/ci.yml` runs lint + typecheck + build on every push and PR to `main`.

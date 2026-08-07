# Smart Link Router & Blog CMS

One short link detects iOS / Android / Desktop, redirects with a 302, and records click analytics. Includes an admin dashboard and a Markdown blog CMS.

Reference product concept: [Onelink.to](https://www.onelink.to/).

## Stack

| Layer | Tech | Folder |
|-------|------|--------|
| Frontend | Next.js 14, React, Tailwind CSS, Recharts | [`client/`](./client) |
| Backend | Node.js, Express, JWT | [`server/`](./server) |
| Database | MongoDB (Mongoose) | — |

## Project layout

| Path | Role |
|------|------|
| `client/` | Next.js UI |
| `server/` | Express API + `/l/:alias` redirects |
| `SETUP.md` | Full local setup + testing guide |
| `.env.example` | Sample env keys (no secrets) |
| `.gitignore` | Ignores `node_modules`, `.env`, `.next`, etc. |
| `package.json` | Optional helpers (`install:all`, `dev:server`, `dev:client`) |

Each package also has its own `README.md`, `SETUP.md`, and `.env.example`.

## Quick start

See **[SETUP.md](./SETUP.md)** for prerequisites, env vars, seed data, and testing.

```bash
# Terminal 1 — Backend
cd server && npm install && npm run seed && npm run dev

# Terminal 2 — Frontend
cd client && npm install && npm run dev
```

| Service | URL |
|---------|-----|
| App | http://localhost:3000 |
| API / redirects | http://localhost:5000 |

## Package docs

| Package | README | SETUP |
|---------|--------|-------|
| Frontend | [client/README.md](./client/README.md) | [client/SETUP.md](./client/SETUP.md) |
| Backend | [server/README.md](./server/README.md) | [server/SETUP.md](./server/SETUP.md) |

## Features

1. Smart link CRUD with iOS / Android / Fallback URLs  
2. `GET /l/:alias` User-Agent routing (302)  
3. Async click analytics with charts  
4. Blog CMS (draft / publish) + public `/blog` pages  
5. Responsive Tailwind UI with loading skeletons  

## License

MIT

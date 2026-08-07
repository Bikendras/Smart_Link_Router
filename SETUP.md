# SETUP.md — Local Setup & Testing Guide

Root setup file for **Smart Link Router & Blog CMS**  
(Reference: [Onelink.to](https://www.onelink.to/))

This guide covers how to **set up**, **run**, **seed data**, and **test** the full app locally.

| App | Folder | Extra docs |
|-----|--------|------------|
| Frontend (Next.js + Tailwind) | `client/` | [client/SETUP.md](./client/SETUP.md) |
| Backend (Node.js + Express) | `server/` | [server/SETUP.md](./server/SETUP.md) |
| Database | MongoDB | Local or Atlas |

---

## 1. Prerequisites

| Tool | Requirement |
|------|-------------|
| **Node.js** | **18+** (20 LTS recommended) |
| **npm** | 9+ |
| **Database** | **MongoDB** — local instance **or** MongoDB Atlas connection string |

Verify:

```bash
node -v
npm -v
```

---

## 2. Environment Variables

Sample keys live in **`.env.example`** (repo root).  
Also copy package-level samples:

```bash
# Backend
cp server/.env.example server/.env

# Frontend
cp client/.env.example client/.env.local
```

### `server/.env` (required keys)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart-link-router
ADMIN_SECRET=admin123
JWT_SECRET=change-me-to-a-long-random-string
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

| Key | Purpose |
|-----|---------|
| `PORT` | API + redirect server port |
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |
| `ADMIN_SECRET` | Admin secret login (local testing) |
| `JWT_SECRET` | Signs auth tokens |
| `CLIENT_URL` | Frontend origin (CORS) |

### `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Do **not** commit real `.env` / `.env.local` files (gitignored). Only `.env.example` files are safe to share.

---

## 3. Installation & Running

Commands to install and start **client + server** (two terminals):

```bash
# Terminal 1 — server
cd server
npm install
npm run seed
npm run dev

# Terminal 2 — client
cd client
npm install
npm run dev
```

| Process | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend / redirects | http://localhost:5000 |
| Health check | http://localhost:5000/health |

### Optional helpers (from repo root)

```bash
npm run install:all
npm run seed
npm run dev:server
npm run dev:client
```

### Seed data

From `server/`:

```bash
npm run seed
```

Creates demo links, sample clicks, blog posts, and accounts:

| Item | Details |
|------|---------|
| `/l/demofb` | Facebook — iOS / Android / Desktop |
| `/l/demobbc` | BBC — desktop → `https://www.bbc.com/` |
| `/l/spotify` | Spotify demo |
| Blog | 2 published + 1 draft |
| Admin | `admin@skinaa.link` / `admin123` (or secret `admin123`) |
| Demo user | `demo@skinaa.link` / `demo123` |

> `npm run seed` clears existing users/links/posts/clicks in this database, then recreates demo data.

---

## 4. Step-by-step Testing Walkthrough

### 4.1 Admin Panel — log in / access

1. Open **http://localhost:3000/dashboard/login**  
   - Email: `admin@skinaa.link`  
   - Password: `admin123`  
   - Or use **Admin secret** login with `admin123`
2. Or register at **http://localhost:3000/dashboard/signup**
3. After login you reach **My Links** (`/dashboard/links`)
4. Without login, dashboard routes redirect to the login page

### 4.2 Simulate User-Agents (iOS / Android / Desktop redirects)

1. Open a short link: **http://localhost:5000/l/demofb**
2. Chrome → **F12** → ⋮ → **More tools** → **Network conditions**
3. Uncheck **Use browser default** under User agent
4. Test:
   - **iPhone** → App Store URL  
   - **Android** (e.g. Pixel) → Google Play URL  
   - **Desktop Chrome** → `https://www.facebook.com/`
5. Also try **http://localhost:5000/l/demobbc** (desktop → `https://www.bbc.com/`)

Each click is logged **asynchronously** so the **302 redirect** stays fast.

Optional: Device Toolbar (`Ctrl+Shift+M`) with iPhone / Pixel presets.

### 4.3 Create a blog post and verify on the public frontend

1. Admin → **Blog CMS** → **New post**
2. Fill **Title**, **Slug**, **Featured Image URL**, **Author**, **Content** (Markdown)
3. Set status to **Published** → save
4. Open public listing: **http://localhost:3000/blog** (card grid of published posts)
5. Open the post: **http://localhost:3000/blog/[slug]** (full content)
6. Confirm **Draft** posts do **not** appear on `/blog`

### Extra checks (recommended)

**Create a smart link**

1. Dashboard → **Create link**
2. Alias + iOS / Android / Fallback URLs → save  
3. Visit `http://localhost:5000/l/<alias>`

**Analytics dashboard**

1. My Links → chart icon → per-link analytics  
2. Verify total clicks, iOS/Android/Desktop breakdown, time-series chart

**Responsive UI**

1. DevTools device mode (phone widths)  
2. Landing hamburger nav + stacked hero  
3. Dashboard sidebar drawer on small screens  

---

## 5. Useful URLs

| Page | URL |
|------|-----|
| Landing | http://localhost:3000 |
| Blog | http://localhost:3000/blog |
| Admin login | http://localhost:3000/dashboard/login |
| Demo Facebook | http://localhost:5000/l/demofb |
| Demo BBC | http://localhost:5000/l/demobbc |
| Demo Spotify | http://localhost:5000/l/spotify |

---

## 6. Project structure

```
SKINAA/
├── client/           # Next.js + Tailwind
├── server/           # Express API + GET /l/:alias
├── SETUP.md          # This file (root)
├── README.md
├── .env.example
├── .gitignore
└── package.json
```

---

## 7. Troubleshooting

| Issue | Fix |
|-------|-----|
| Mongo connection error | Start MongoDB or set Atlas URI in `MONGODB_URI` |
| CORS / API failed | Match `CLIENT_URL` and `NEXT_PUBLIC_API_URL` to your ports |
| 401 Unauthorized | Log in again; check `JWT_SECRET` |
| Redirect always desktop | Apply User-Agent override, then hard refresh |
| `/l/demobbc` not found | Run `npm run seed` inside `server/` |
| Country shows Unknown | Local/private IPs cannot be geolocated |

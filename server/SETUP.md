# Backend Setup Guide (`server/`)

How to run the **API + smart redirect engine** on any machine.

---

## 1. Prerequisites

| Tool | Version |
|------|---------|
| Node.js | **18+** (20 LTS recommended) |
| npm | 9+ |
| MongoDB | Local MongoDB **or** MongoDB Atlas URI |

```bash
node -v
npm -v
```

---

## 2. Environment Variables

Copy the sample file:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart-link-router
ADMIN_SECRET=admin123
JWT_SECRET=change-me-to-a-long-random-string
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

| Key | Meaning |
|-----|---------|
| `PORT` | API / redirect port (default `5000`) |
| `MONGODB_URI` | Local or Atlas connection string |
| `ADMIN_SECRET` | Password for seeded admin + secret login |
| `JWT_SECRET` | Signs auth tokens (change in production) |
| `CLIENT_URL` | Frontend origin for CORS (e.g. `http://localhost:3000`) |

---

## 3. Install, seed, run

```bash
cd server
npm install
npm run seed
npm run dev
```

| Check | URL |
|-------|-----|
| Health | http://localhost:5000/health |
| Demo Facebook | http://localhost:5000/l/demofb |
| Demo BBC | http://localhost:5000/l/demobbc → desktop `https://www.bbc.com/` |
| Demo Spotify | http://localhost:5000/l/spotify |

### What `npm run seed` creates

- Admin: `admin@skinaa.link` / `admin123` (or login with admin secret)
- Demo user: `demo@skinaa.link` / `demo123`
- Links: `demofb`, `demobbc`, `spotify`
- Blog: 2 published + 1 draft
- Sample click events for analytics charts

> **Note:** Seed **wipes** existing users/links/posts/clicks in this database, then recreates demo data.

---

## 4. Backend testing walkthrough

### A. Health

```bash
curl http://localhost:5000/health
```

Expect: `{ "ok": true, "service": "smart-link-router" }`

### B. Smart redirect (User-Agent)

1. Open `http://localhost:5000/l/demofb` in Chrome
2. F12 → Network conditions → override User-Agent:
   - **iPhone** → App Store URL
   - **Android** → Play Store URL
   - **Desktop** → `https://www.facebook.com/`
3. Repeat with `/l/demobbc` (desktop → `https://www.bbc.com/`) and `/l/spotify`

Clicks are logged **asynchronously** (`setImmediate`) so redirects stay fast.

### C. Auth + links API (optional)

Use the frontend dashboard, or call APIs with a JWT from `/api/auth/login`.

---

## 5. Scripts

| Script | Command |
|--------|---------|
| Dev (nodemon) | `npm run dev` |
| Production start | `npm start` |
| Seed DB | `npm run seed` |

---

## 6. Troubleshooting

| Issue | Fix |
|-------|-----|
| Mongo connection error | Start local MongoDB or fix Atlas `MONGODB_URI` / IP allowlist |
| CORS errors from browser | Set `CLIENT_URL` to the exact frontend origin |
| Link not found on `/l/:alias` | Run `npm run seed` or create the link in the dashboard |
| Always redirects to desktop | Confirm User-Agent override is applied, then hard refresh |

---

## 7. Pair with frontend

In a second terminal, start the Next.js app from `../client` (see `../client/SETUP.md`).  
Full monorepo guide: **[../SETUP.md](../SETUP.md)**.

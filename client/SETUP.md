# Frontend Setup Guide (`client/`)

How to run the **Next.js** app on any machine.

---

## 1. Prerequisites

| Tool | Version |
|------|---------|
| Node.js | **18+** (20 LTS recommended) |
| npm | 9+ |
| Backend | Running API at the URL in `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`) |

```bash
node -v
npm -v
```

Start the backend first — see **[../server/SETUP.md](../server/SETUP.md)**.

---

## 2. Environment Variables

```bash
cd client
cp .env.example .env.local
```

`client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

| Key | Meaning |
|-----|---------|
| `NEXT_PUBLIC_API_URL` | Express API base URL (no trailing slash) |

Short links shown in the UI use this same host, e.g. `http://localhost:5000/l/demofb`.

---

## 3. Install & run

```bash
cd client
npm install
npm run dev
```

App: **http://localhost:3000**

| Script | Command |
|--------|---------|
| Dev | `npm run dev` |
| Production build | `npm run build` |
| Production start | `npm start` |
| Lint | `npm run lint` |

---

## 4. Frontend testing walkthrough

### A. Public site

1. Open http://localhost:3000 — landing + demo QR rotator (Facebook / BBC / Spotify)
2. Resize browser / use DevTools device mode — check mobile hamburger nav and stacked hero
3. Visit `/blog` — only **published** posts in the card grid
4. Open a post at `/blog/[slug]`

### B. Admin panel

1. Sign up: http://localhost:3000/dashboard/signup  
   **or** log in: http://localhost:3000/dashboard/login  
   - Seeded admin: `admin@skinaa.link` / `admin123`  
   - Or “Admin secret”: `admin123`
2. **My Links** → Create link (iOS / Android / Fallback) → edit / delete
3. Chart icon → analytics (totals, platform pie, time series)
4. **Blog CMS** → New post → Markdown → status **Published** → verify on `/blog`

### C. Redirect demos from the landing page

Click the green short URL in the demo card (opens backend `/l/:alias`).  
Desktop BBC demo must land on `https://www.bbc.com/`.

---

## 5. Troubleshooting

| Issue | Fix |
|-------|-----|
| API / network errors | Confirm server is on port 5000 and `NEXT_PUBLIC_API_URL` matches |
| Port 3000 in use | Next.js may use 3001 — update bookmarks; keep `CLIENT_URL` on server in sync if you change ports |
| Empty blog | Seed backend or publish a post from the CMS |
| 401 on dashboard | Log in again; check server `JWT_SECRET` |

---

## 6. Pair with backend

Full monorepo (both apps) guide: **[../SETUP.md](../SETUP.md)**.

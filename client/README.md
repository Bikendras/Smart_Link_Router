# Smart Link Router — Frontend (Next.js)

Public marketing site + admin dashboard for the Smart Link Router & Blog CMS.

- Landing, About, Pricing, Support
- Public blog: `/blog` and `/blog/[slug]`
- Dashboard: links CRUD, analytics charts, Markdown blog CMS
- Demo rotator with QR codes for seeded short links

## Stack

| Piece | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| UI | React 18, Tailwind CSS |
| Charts | Recharts |
| Markdown | react-markdown + remark-gfm |
| QR | qrcode.react |

## Quick start

Full steps: **[SETUP.md](./SETUP.md)**

```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

- App: `http://localhost:3000`
- Requires the backend on `http://localhost:5000` (see `../server`)

## Main pages

| Page | Path |
|------|------|
| Landing | `/` |
| Blog list | `/blog` |
| Blog post | `/blog/[slug]` |
| Sign up / Log in | `/dashboard/signup`, `/dashboard/login` |
| My Links | `/dashboard/links` |
| Create / Edit link | `/dashboard/links/new`, `/dashboard/links/[id]/edit` |
| Analytics | `/dashboard/links/[id]/analytics` |
| Blog CMS | `/dashboard/blog` |

## Folder structure

```
client/
├── src/
│   ├── app/                 # App Router pages
│   ├── components/          # Navbar, AdminShell, DemoRotator, …
│   └── lib/                 # api.ts, auth.ts, blogServer.ts
├── .env.example
├── SETUP.md
├── README.md
├── tailwind.config.ts
└── package.json
```

## Responsive UI

- Public nav: hamburger menu below `md`
- Hero: single column on mobile, 2-column from `md`
- Dashboard: slide-out sidebar below `lg`; card lists replace tables on small screens
- Blog grid: 1 → 2 → 3 columns (`sm` / `lg`)

## Related

Backend: `../server`. Root repo docs: `../README.md` and `../SETUP.md`.

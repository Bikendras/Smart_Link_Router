# Smart Link Router — Backend (API + Redirect Engine)

Node.js + Express + MongoDB service that powers:

- REST APIs for auth, smart links, analytics, and blog CMS
- Smart redirection at `GET /l/:alias` (User-Agent → iOS / Android / Desktop → **302**)
- Async click logging (does not block redirects)

## Stack

| Piece | Tech |
|-------|------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |

## Quick start

Full steps: **[SETUP.md](./SETUP.md)**

```bash
cd server
cp .env.example .env   # then edit MONGODB_URI if needed
npm install
npm run seed
npm run dev
```

- API: `http://localhost:5000`
- Health: `http://localhost:5000/health`
- Example redirect: `http://localhost:5000/l/demofb`

## Main routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login (email/password or admin secret) |
| CRUD | `/api/links` | Short links (auth required) |
| GET | `/api/links/:id/analytics` | Per-link analytics |
| GET | `/l/:alias` | Smart OS redirect + async click log |
| CRUD | `/api/posts` | Blog posts (public list/slug + admin CRUD) |

## Folder structure

```
server/
├── src/
│   ├── index.js              # Express app entry
│   ├── config/db.js          # Mongo connection
│   ├── models/               # User, Link, Click, BlogPost
│   ├── controllers/          # Business logic
│   ├── routes/               # API routers
│   ├── middleware/auth.js    # JWT guard
│   ├── utils/userAgent.js    # OS / device / IP helpers
│   └── seed.js               # Demo data
├── .env.example
├── SETUP.md
├── README.md
└── package.json
```

## Related

Frontend lives in `../client` (Next.js). Root repo docs: `../README.md` and `../SETUP.md`.

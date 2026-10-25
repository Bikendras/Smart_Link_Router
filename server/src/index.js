const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const authRouter = require('./routes/auth');
const linksRouter = require('./routes/links');
const postsRouter = require('./routes/posts');
const chatRouter = require('./routes/chat');
const { redirectByAlias } = require('./controllers/linkController');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser / same-origin tools (no Origin header)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

/** Ensure MongoDB is connected (needed on Vercel cold starts). */
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

const redirectLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'smart-link-router',
    health: '/health',
    redirects: '/l/:alias',
    api: {
      auth: '/api/auth',
      links: '/api/links',
      posts: '/api/posts',
      chat: '/api/chat',
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'smart-link-router' });
});

app.use('/api/auth', authRouter);
app.use('/api/links', linksRouter);
app.use('/api/posts', postsRouter);
app.use('/api/chat', chatRouter);

app.get('/l/:alias', redirectLimiter, redirectByAlias);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

/** Local / traditional host: listen on a port. Vercel uses the exported app. */
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Redirects: http://localhost:${PORT}/l/:alias`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;

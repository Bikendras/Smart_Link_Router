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
const { redirectByAlias } = require('./controllers/linkController');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

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
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'smart-link-router' });
});

app.use('/api/auth', authRouter);
app.use('/api/links', linksRouter);
app.use('/api/posts', postsRouter);

app.get('/l/:alias', redirectLimiter, redirectByAlias);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

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

start();

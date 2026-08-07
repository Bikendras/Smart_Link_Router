require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Link = require('./models/Link');
const BlogPost = require('./models/BlogPost');
const Click = require('./models/Click');

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Link.deleteMany({}),
    BlogPost.deleteMany({}),
    Click.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@skinaa.link',
    password: process.env.ADMIN_SECRET || 'admin123',
    role: 'admin',
  });

  const demoUser = await User.create({
    name: 'Demo User',
    email: 'demo@skinaa.link',
    password: 'demo123',
    role: 'user',
  });

  const [demo, spotify, bbc] = await Link.create([
    {
      userId: admin._id,
      title: 'Facebook Demo',
      alias: 'demofb',
      iosUrl: 'https://apps.apple.com/app/facebook/id284882215',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.facebook.katana',
      fallbackUrl: 'https://www.facebook.com/',
      isActive: true,
    },
    {
      userId: admin._id,
      title: 'Spotify Demo',
      alias: 'spotify',
      iosUrl: 'https://apps.apple.com/app/spotify-music/id324684580',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.spotify.music',
      fallbackUrl: 'https://open.spotify.com/',
      isActive: true,
    },
    {
      userId: admin._id,
      title: 'BBC Demo',
      alias: 'demobbc',
      iosUrl: 'https://apps.apple.com/app/bbc-news/id364147881',
      androidUrl: 'https://play.google.com/store/apps/details?id=bbc.mobile.news.ww',
      fallbackUrl: 'https://www.bbc.com/',
      isActive: true,
    },
  ]);

  const now = new Date();
  const clicks = [];
  const platforms = ['ios', 'android', 'desktop'];
  for (let i = 0; i < 40; i++) {
    const dayOffset = Math.floor(Math.random() * 14);
    const ts = new Date(now);
    ts.setDate(ts.getDate() - dayOffset);
    clicks.push({
      linkId: demo._id,
      alias: demo.alias,
      timestamp: ts,
      ip: `203.0.113.${(i % 50) + 1}`,
      country: ['India', 'US', 'UK', 'Unknown'][i % 4],
      os: platforms[i % 3],
      referrer: i % 2 === 0 ? 'https://twitter.com' : '',
      userAgent: 'seed',
    });
  }
  await Click.insertMany(clicks);

  await BlogPost.create([
    {
      userId: admin._id,
      title: 'What is a Smart Download Link?',
      slug: 'what-is-a-smart-download-link',
      featuredImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80',
      author: 'Team SKINAA',
      excerpt:
        'One link that detects the visitor device and routes them to the right app store or web page.',
      content: `## Smart download links explained

A **smart download link** is a single short URL that sends each visitor to the right place based on their device.

### How it works

1. Someone clicks your short link (for example \`/l/demofb\`)
2. We read their device from the request
3. We redirect them with a **302**:
   - **iOS** → App Store
   - **Android** → Google Play
   - **Desktop** → your website

### Why it helps

You stop shipping separate store links and QR codes. One link, one QR, correct destination.
`,
      status: 'published',
      publishedAt: new Date(Date.now() - 3 * 86400000),
    },
    {
      userId: admin._id,
      title: 'Reading Click Analytics Without Guesswork',
      slug: 'reading-click-analytics',
      featuredImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80',
      author: 'Team SKINAA',
      excerpt: 'See which platforms drive traffic — totals, breakdowns, and recent clicks.',
      content: `## What you can measure

Every smart link click stores a few useful fields:

- When it happened
- iOS, Android, or desktop
- Referrer (if the browser sent one)
- Country when it can be resolved

Open a link in the dashboard and use **Analytics** for totals, platform share, and a daily chart.

Clicks are saved after the redirect starts, so visitors are not waiting on logging.
`,
      status: 'published',
      publishedAt: new Date(Date.now() - 1 * 86400000),
    },
    {
      userId: admin._id,
      title: 'Draft: Upcoming Analytics Features',
      slug: 'upcoming-analytics-features',
      author: 'Team SKINAA',
      excerpt: 'Internal notes on future analytics improvements.',
      content: 'This draft stays private until you publish it.',
      status: 'draft',
    },
  ]);

  console.log('Seed complete.');
  console.log('Demo links:');
  console.log(`  http://localhost:${process.env.PORT || 5000}/l/${demo.alias}`);
  console.log(`  http://localhost:${process.env.PORT || 5000}/l/${spotify.alias}`);
  console.log(`  http://localhost:${process.env.PORT || 5000}/l/${bbc.alias}`);
  console.log('');
  console.log('Accounts:');
  console.log(`  Admin  → email: admin@skinaa.link  OR secret: ${process.env.ADMIN_SECRET || 'admin123'}`);
  console.log('  Demo   → email: demo@skinaa.link / password: demo123 (empty dashboard)');
  console.log(`  Demo user id: ${demoUser._id}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

const Link = require('../models/Link');
const Click = require('../models/Click');
const { detectOS, detectDevice, getClientIp, resolveCountry } = require('../utils/userAgent');

function findOwnedLink(req, id) {
  if (req.user?.role === 'admin') {
    return Link.findById(id);
  }
  return Link.findOne({ _id: id, userId: req.user.id });
}

async function listLinks(req, res) {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const links = await Link.find(query).sort({ createdAt: -1 }).lean();
    const ids = links.map((l) => l._id);
    const counts = await Click.aggregate([
      { $match: { linkId: { $in: ids } } },
      { $group: { _id: '$linkId', total: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.total]));

    const withStats = links.map((link) => ({
      ...link,
      clickCount: countMap[String(link._id)] || 0,
    }));

    res.json({ success: true, data: withStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getLink(req, res) {
  try {
    const link = await findOwnedLink(req, req.params.id);
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }
    const lean = link.toObject ? link.toObject() : link;
    const clickCount = await Click.countDocuments({ linkId: lean._id });
    res.json({ success: true, data: { ...lean, clickCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createLink(req, res) {
  try {
    const { title, alias, iosUrl, androidUrl, fallbackUrl, isActive } = req.body;

    if (!title || !alias || !iosUrl || !androidUrl || !fallbackUrl) {
      return res.status(400).json({
        success: false,
        message: 'title, alias, iosUrl, androidUrl, and fallbackUrl are required',
      });
    }

    const exists = await Link.findOne({ alias: alias.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Alias already taken' });
    }

    const link = await Link.create({
      userId: req.user.id,
      title,
      alias: alias.toLowerCase().trim(),
      iosUrl,
      androidUrl,
      fallbackUrl,
      isActive: isActive !== false,
    });

    res.status(201).json({ success: true, data: link });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function updateLink(req, res) {
  try {
    const { title, alias, iosUrl, androidUrl, fallbackUrl, isActive } = req.body;
    const link = await findOwnedLink(req, req.params.id);
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    if (alias && alias.toLowerCase().trim() !== link.alias) {
      const exists = await Link.findOne({ alias: alias.toLowerCase().trim() });
      if (exists) {
        return res.status(409).json({ success: false, message: 'Alias already taken' });
      }
      link.alias = alias.toLowerCase().trim();
    }

    if (title !== undefined) link.title = title;
    if (iosUrl !== undefined) link.iosUrl = iosUrl;
    if (androidUrl !== undefined) link.androidUrl = androidUrl;
    if (fallbackUrl !== undefined) link.fallbackUrl = fallbackUrl;
    if (isActive !== undefined) link.isActive = isActive;

    await link.save();
    res.json({ success: true, data: link });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function deleteLink(req, res) {
  try {
    const link = await findOwnedLink(req, req.params.id);
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }
    await Link.deleteOne({ _id: link._id });
    await Click.deleteMany({ linkId: link._id });
    res.json({ success: true, message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function redirectByAlias(req, res) {
  try {
    const alias = String(req.params.alias || '').toLowerCase().trim();
    const link = await Link.findOne({ alias, isActive: true }).lean();

    if (!link) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html><head><title>Link not found</title>
        <style>body{font-family:system-ui;display:grid;place-items:center;min-height:100vh;background:#f5f5f5;color:#333}
        .box{background:#fff;padding:2rem;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.08);text-align:center}
        a{color:#2d6a3e}</style></head>
        <body><div class="box"><h1>Link not found</h1>
        <p>No active short link for <strong>/${alias}</strong></p>
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}">Go home</a></div></body></html>
      `);
    }

    const userAgent = req.headers['user-agent'] || '';
    const os = detectOS(userAgent);
    const device = detectDevice(userAgent);
    const ip = getClientIp(req);
    const referrer = req.headers.referer || req.headers.referrer || '';
    const headerCountry =
      req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || '';

    let targetUrl = link.fallbackUrl;
    if (os === 'ios') targetUrl = link.iosUrl;
    else if (os === 'android') targetUrl = link.androidUrl;

    setImmediate(() => {
      (async () => {
        const country = await resolveCountry(ip, headerCountry);
        await Click.create({
          linkId: link._id,
          alias: link.alias,
          timestamp: new Date(),
          ip,
          country,
          os,
          device,
          referrer,
          userAgent: userAgent.slice(0, 500),
        });
      })().catch((err) => console.error('Click log failed:', err.message));
    });

    return res.redirect(302, targetUrl);
  } catch (err) {
    console.error('Redirect error:', err);
    return res.status(500).send('Redirect failed');
  }
}

async function getLinkAnalytics(req, res) {
  try {
    const linkDoc = await findOwnedLink(req, req.params.id);
    if (!linkDoc) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }
    const link = linkDoc.toObject ? linkDoc.toObject() : linkDoc;

    const days = Math.min(Number(req.query.days) || 30, 90);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [totalClicks, osBreakdown, timeSeries, recentClicks] = await Promise.all([
      Click.countDocuments({ linkId: link._id }),
      Click.aggregate([
        { $match: { linkId: link._id } },
        { $group: { _id: '$os', count: { $sum: 1 } } },
      ]),
      Click.aggregate([
        { $match: { linkId: link._id, timestamp: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Click.find({ linkId: link._id })
        .sort({ timestamp: -1 })
        .limit(20)
        .select('timestamp os device ip country referrer')
        .lean(),
    ]);

    const platformStats = { ios: 0, android: 0, desktop: 0 };
    osBreakdown.forEach((row) => {
      platformStats[row._id] = row.count;
    });

    res.json({
      success: true,
      data: {
        link,
        totalClicks,
        platformStats,
        timeSeries: timeSeries.map((d) => ({ date: d._id, count: d.count })),
        recentClicks,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  listLinks,
  getLink,
  createLink,
  updateLink,
  deleteLink,
  redirectByAlias,
  getLinkAnalytics,
};

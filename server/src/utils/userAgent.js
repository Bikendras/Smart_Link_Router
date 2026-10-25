function detectOS(userAgent = '') {
  const ua = String(userAgent).toLowerCase();

  // iPadOS often reports as Macintosh + Mobile
  if (
    /iphone|ipad|ipod/.test(ua) ||
    (ua.includes('macintosh') && ua.includes('mobile'))
  ) { 
    return 'ios';
  }

  if (ua.includes('android')) {
    return 'android';
  }

  return 'desktop';
}

function detectDevice(userAgent = '') {
  const ua = String(userAgent).toLowerCase();

  if (
    /ipad|tablet|kindle|playbook|silk/.test(ua) ||
    (ua.includes('android') && !ua.includes('mobile'))
  ) {
    return 'tablet';
  }

  if (/mobi|iphone|ipod|android.*mobile|windows phone|opera mini/.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function isPrivateIp(ip = '') {
  const cleaned = String(ip).replace(/^::ffff:/, '');
  if (!cleaned || cleaned === 'unknown' || cleaned === '::1' || cleaned === 'localhost') {
    return true;
  }
  return (
    cleaned.startsWith('127.') ||
    cleaned.startsWith('10.') ||
    cleaned.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(cleaned)
  );
}

async function resolveCountry(ip, headerCountry) {
  const fromHeader = String(headerCountry || '').trim();
  if (fromHeader && fromHeader !== 'Unknown' && fromHeader !== 'XX' && fromHeader !== 'T1') {
    return fromHeader.length === 2 ? fromHeader.toUpperCase() : fromHeader;
  }

  if (isPrivateIp(ip)) return 'Unknown';

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(String(ip).replace(/^::ffff:/, ''))}?fields=status,countryCode`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    const data = await res.json();
    if (data.status === 'success' && data.countryCode) {
      return data.countryCode;
    }
  } catch {
    // geo lookup is best-effort
  }

  return 'Unknown';
}

module.exports = { detectOS, detectDevice, getClientIp, resolveCountry };

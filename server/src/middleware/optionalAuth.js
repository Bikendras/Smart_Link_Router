const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/** Attach req.user when a valid Bearer token is present; never block guests. */
async function optionalAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!bearer) return next();

    const decoded = verifyToken(bearer);
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = {
        id: String(user._id),
        email: user.email,
        name: user.name || '',
        role: user.role,
      };
    }
  } catch {
    // Guest flow — ignore invalid/expired tokens
  }
  return next();
}

module.exports = { optionalAuth };

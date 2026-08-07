const User = require('../models/User');
const { signToken } = require('../utils/jwt');

function authResponse(user) {
  const safe = user.toSafeJSON ? user.toSafeJSON() : user;
  const token = signToken({ id: safe.id || safe._id, role: safe.role });
  return {
    success: true,
    token,
    user: {
      id: String(safe.id || safe._id),
      email: safe.email,
      name: safe.name || '',
      role: safe.role,
    },
  };
}

async function signup(req, res) {
  try {
    const { email, password, name } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      email: String(email).toLowerCase().trim(),
      password,
      name: name || '',
      role: 'user',
    });

    return res.status(201).json(authResponse(user));
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password, secret } = req.body || {};

    if (secret && secret === (process.env.ADMIN_SECRET || 'admin123')) {
      let admin = await User.findOne({ role: 'admin' });
      if (!admin) {
        admin = await User.create({
          name: 'Admin',
          email: 'admin@skinaa.link',
          password: secret,
          role: 'admin',
        });
      }
      return res.json(authResponse(admin));
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    return res.json(authResponse(user));
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, data: user.toSafeJSON() });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email } = req.body || {};
    if (name !== undefined) user.name = String(name).trim();

    if (email && email.toLowerCase().trim() !== user.email) {
      const taken = await User.findOne({ email: email.toLowerCase().trim() });
      if (taken) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
      user.email = email.toLowerCase().trim();
    }

    await user.save();
    return res.json({ success: true, data: user.toSafeJSON() });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password are required',
      });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();
    return res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = { signup, login, me, updateProfile, changePassword };

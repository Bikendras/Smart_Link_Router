const express = require('express');
const {
  signup,
  login,
  me,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.put('/profile', requireAuth, updateProfile);
router.put('/password', requireAuth, changePassword);

module.exports = router;

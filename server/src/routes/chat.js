const express = require('express');
const {
  sendMessage,
  receiveReply,
  getSession,
  getHistory,
} = require('../controllers/chatController');
const { optionalAuth } = require('../middleware/optionalAuth');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/send', optionalAuth, sendMessage);
router.post('/reply', receiveReply);
router.get('/session/:sessionId', getSession);
router.get('/history', requireAuth, getHistory);

module.exports = router;

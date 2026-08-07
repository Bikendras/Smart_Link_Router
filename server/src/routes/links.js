const express = require('express');
const {
  listLinks,
  getLink,
  createLink,
  updateLink,
  deleteLink,
  getLinkAnalytics,
} = require('../controllers/linkController');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAdmin, listLinks);
router.get('/:id', requireAdmin, getLink);
router.get('/:id/analytics', requireAdmin, getLinkAnalytics);
router.post('/', requireAdmin, createLink);
router.put('/:id', requireAdmin, updateLink);
router.delete('/:id', requireAdmin, deleteLink);

module.exports = router;

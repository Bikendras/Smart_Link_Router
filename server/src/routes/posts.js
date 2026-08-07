const express = require('express');
const {
  listPostsAdmin,
  listPublishedPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/blogController');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public
router.get('/public', listPublishedPosts);
router.get('/public/:slug', getPostBySlug);

// Admin
router.get('/', requireAdmin, listPostsAdmin);
router.get('/:id', requireAdmin, getPostById);
router.post('/', requireAdmin, createPost);
router.put('/:id', requireAdmin, updatePost);
router.delete('/:id', requireAdmin, deletePost);

module.exports = router;

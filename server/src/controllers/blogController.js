const BlogPost = require('../models/BlogPost');

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function findOwnedPost(req, id) {
  if (req.user?.role === 'admin') {
    return BlogPost.findById(id);
  }
  return BlogPost.findOne({ _id: id, userId: req.user.id });
}

async function listPostsAdmin(req, res) {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const posts = await BlogPost.find(query).sort({ updatedAt: -1 }).lean();
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function listPublishedPosts(req, res) {
  try {
    const posts = await BlogPost.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .select('title slug featuredImage author excerpt publishedAt createdAt')
      .lean();
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getPostBySlug(req, res) {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      status: 'published',
    }).lean();

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getPostById(req, res) {
  try {
    const post = await findOwnedPost(req, req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createPost(req, res) {
  try {
    const { title, slug, featuredImage, author, content, excerpt, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'title and content are required',
      });
    }

    const finalSlug = (slug || slugify(title)).toLowerCase().trim();
    const exists = await BlogPost.findOne({ slug: finalSlug });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Slug already exists' });
    }

    const postStatus = status === 'published' ? 'published' : 'draft';
    const post = await BlogPost.create({
      userId: req.user.id,
      title,
      slug: finalSlug,
      featuredImage: featuredImage || '',
      author: author || req.user.name || 'Author',
      content,
      excerpt: excerpt || content.slice(0, 160).replace(/[#*`]/g, ''),
      status: postStatus,
      publishedAt: postStatus === 'published' ? new Date() : undefined,
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function updatePost(req, res) {
  try {
    const post = await findOwnedPost(req, req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const { title, slug, featuredImage, author, content, excerpt, status } = req.body;

    if (slug && slug.toLowerCase().trim() !== post.slug) {
      const exists = await BlogPost.findOne({ slug: slug.toLowerCase().trim() });
      if (exists) {
        return res.status(409).json({ success: false, message: 'Slug already exists' });
      }
      post.slug = slug.toLowerCase().trim();
    }

    if (title !== undefined) post.title = title;
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (author !== undefined) post.author = author;
    if (content !== undefined) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;

    if (status !== undefined) {
      const wasPublished = post.status === 'published';
      post.status = status === 'published' ? 'published' : 'draft';
      if (post.status === 'published' && !wasPublished) {
        post.publishedAt = new Date();
      }
    }

    await post.save();
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function deletePost(req, res) {
  try {
    const post = await findOwnedPost(req, req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    await BlogPost.deleteOne({ _id: post._id });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  listPostsAdmin,
  listPublishedPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

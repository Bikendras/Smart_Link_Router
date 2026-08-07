const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    featuredImage: {
      type: String,
      default: '',
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      default: 'Admin',
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      default: '',
      maxlength: 300,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

blogPostSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);

const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema(
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
      maxlength: 120,
    },
    alias: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-_]+$/, 'Alias can only contain letters, numbers, hyphens and underscores'],
    },
    iosUrl: {
      type: String,
      required: true,
      trim: true,
    },
    androidUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fallbackUrl: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Link', linkSchema);

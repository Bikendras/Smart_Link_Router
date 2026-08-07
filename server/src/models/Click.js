const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema(
  {
    linkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Link',
      required: true,
      index: true,
    },
    alias: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ip: {
      type: String,
      default: 'unknown',
    },
    country: {
      type: String,
      default: 'Unknown',
    },
    os: {
      type: String,
      enum: ['ios', 'android', 'desktop'],
      required: true,
      index: true,
    },
    device: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop'],
      default: 'desktop',
      index: true,
    },
    referrer: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  { timestamps: false }
);

clickSchema.index({ linkId: 1, timestamp: -1 });

module.exports = mongoose.model('Click', clickSchema);

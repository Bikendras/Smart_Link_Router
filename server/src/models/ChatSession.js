const mongoose = require('mongoose');

/** Temporary session so n8n can callback with an answer (guest + logged-in). */
const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    answer: {
      type: String,
      default: null,
      maxlength: 8000,
    },
    status: {
      type: String,
      enum: ['pending', 'done', 'error'],
      default: 'pending',
      index: true,
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

/** Auto-clean old guest/pending sessions after 24h */
chatSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);

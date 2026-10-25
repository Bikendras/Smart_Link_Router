const crypto = require('crypto');
const ChatMessage = require('../models/ChatMessage');
const ChatSession = require('../models/ChatSession');

function getN8nWebhookUrl() {
  return (process.env.N8N_WEBHOOK_URL || '').trim();
}

function getChatSecret() {
  return (process.env.N8N_CHAT_SECRET || '').trim();
}

/** Accepts a plain string or a raw Gemini / n8n output object. */
function extractAnswerText(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(extractAnswerText).filter(Boolean).join('\n').trim();
  if (typeof value === 'object') {
    if (typeof value.text === 'string') return value.text.trim();
    if (value.content) return extractAnswerText(value.content);
    if (value.parts) return extractAnswerText(value.parts);
    if (value.candidates) return extractAnswerText(value.candidates[0]);
    if (value.output) return extractAnswerText(value.output);
  }
  return '';
}

function buildReplyUrl(req) {
  const host = req.get('host');
  const proto = req.get('x-forwarded-proto') || req.protocol || 'http';
  return `${proto}://${host}/api/chat/reply`;
}

/** POST /api/chat/send — optional auth */
async function sendMessage(req, res) {
  try {
    const question = String(req.body?.message || req.body?.question || '').trim();
    if (!question) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    if (question.length > 4000) {
      return res.status(400).json({ success: false, message: 'Message is too long' });
    }

    const webhookUrl = getN8nWebhookUrl();
    if (!webhookUrl) {
      return res.status(503).json({
        success: false,
        message: 'Chat is not configured. Set N8N_WEBHOOK_URL on the server.',
      });
    }

    const sessionId = crypto.randomUUID();
    const userId = req.user?.id || null;

    await ChatSession.create({
      sessionId,
      userId,
      question,
      status: 'pending',
    });

    if (userId) {
      await ChatMessage.create({
        userId,
        sessionId,
        content: question,
        type: 'QUESTION',
      });
    }

    const payload = {
      sessionId,
      question,
      message: question,
      userId,
      isLoggedIn: Boolean(userId),
      replyUrl: buildReplyUrl(req),
    };

    const headers = { 'Content-Type': 'application/json' };
    const secret = getChatSecret();
    if (secret) headers['x-chat-secret'] = secret;

    // Fire-and-forget to n8n; client will poll session status
    const markError = (errorMessage) =>
      ChatSession.findOneAndUpdate(
        { sessionId, status: 'pending' },
        { status: 'error', errorMessage }
      ).catch(() => {});

    fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })
      .then(async (n8nRes) => {
        if (n8nRes.ok) return;
        const text = await n8nRes.text().catch(() => '');
        console.error(`n8n webhook returned ${n8nRes.status}: ${text.slice(0, 300)}`);
        await markError(
          n8nRes.status === 404
            ? 'AI workflow is not active. Publish the n8n workflow and try again.'
            : `AI service error (${n8nRes.status})`
        );
      })
      .catch(async (err) => {
        console.error('n8n webhook failed:', err.message);
        await markError('Failed to reach AI service');
      });

    return res.status(202).json({
      success: true,
      data: {
        sessionId,
        status: 'pending',
        stored: Boolean(userId),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
}

/** POST /api/chat/reply — called by n8n */
async function receiveReply(req, res) {
  try {
    const secret = getChatSecret();
    if (secret) {
      const header = req.headers['x-chat-secret'] || req.headers['x-n8n-secret'] || '';
      const bodySecret = req.body?.secret || '';
      if (header !== secret && bodySecret !== secret) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
    }

    const sessionId = String(req.body?.sessionId || '').trim();
    const answer = extractAnswerText(
      req.body?.answer ?? req.body?.reply ?? req.body?.message ?? req.body?.output
    );
    const isError = Boolean(req.body?.error);

    if (!sessionId) {
      console.error('chat reply rejected: missing sessionId', JSON.stringify(req.body).slice(0, 300));
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }
    if (!answer && !isError) {
      console.error('chat reply rejected: empty answer', JSON.stringify(req.body).slice(0, 300));
      return res.status(400).json({ success: false, message: 'answer is required' });
    }

    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.status === 'done') {
      return res.json({ success: true, message: 'Already completed', data: { sessionId } });
    }

    if (isError) {
      session.status = 'error';
      session.errorMessage = answer || 'AI service error';
      session.answer = null;
      await session.save();
      return res.json({ success: true, data: { sessionId, status: 'error' } });
    }

    session.answer = answer;
    session.status = 'done';
    session.errorMessage = '';
    await session.save();

    if (session.userId) {
      await ChatMessage.create({
        userId: session.userId,
        sessionId,
        content: answer,
        type: 'AI_ANSWER',
      });
    }

    return res.json({
      success: true,
      data: {
        sessionId,
        status: 'done',
        stored: Boolean(session.userId),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
}

/** GET /api/chat/session/:sessionId — poll for answer */
async function getSession(req, res) {
  try {
    const sessionId = String(req.params.sessionId || '').trim();
    const session = await ChatSession.findOne({ sessionId }).lean();
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    return res.json({
      success: true,
      data: {
        sessionId: session.sessionId,
        status: session.status,
        question: session.question,
        answer: session.answer,
        errorMessage: session.errorMessage || '',
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
}

/** GET /api/chat/history — logged-in only */
async function getHistory(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 200);
    const messages = await ChatMessage.find({ userId: req.user.id })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      data: messages.map((m) => ({
        id: String(m._id),
        sessionId: m.sessionId,
        content: m.content,
        type: m.type,
        createdAt: m.createdAt,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
}

module.exports = {
  sendMessage,
  receiveReply,
  getSession,
  getHistory,
};

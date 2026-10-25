'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Loader2, MessageCircle, Send, X } from 'lucide-react';
import { api, type ChatHistoryItem } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';

type UiMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  pending?: boolean;
};

function historyToUi(items: ChatHistoryItem[]): UiMessage[] {
  return items.map((m) => ({
    id: m.id,
    role: m.type === 'QUESTION' ? 'user' : 'ai',
    content: m.content,
  }));
}

async function waitForAnswer(sessionId: string, signal: AbortSignal) {
  const started = Date.now();
  const timeoutMs = 90_000;

  while (Date.now() - started < timeoutMs) {
    if (signal.aborted) throw new Error('Cancelled');
    const { data } = await api.getChatSession(sessionId);
    if (data.status === 'done' && data.answer) return data.answer;
    if (data.status === 'error') {
      throw new Error(data.errorMessage || 'Something went wrong. Please try again.');
    }
    await new Promise((r) => setTimeout(r, 1200));
  }
  throw new Error('Taking too long. Please try again in a moment.');
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    const onStorage = () => setLoggedIn(isLoggedIn());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    if (!isLoggedIn()) {
      setMessages((prev) =>
        prev.length
          ? prev
          : [
              {
                id: 'welcome',
                role: 'ai',
                content:
                  'Hi! I can help with smart links, analytics, and SKINAA Link. Ask me anything — guest chats are not saved.',
              },
            ]
      );
      return;
    }

    let cancelled = false;
    (async () => {
      setHistoryLoading(true);
      try {
        const { data } = await api.getChatHistory();
        if (cancelled) return;
        if (data.length) {
          setMessages(historyToUi(data));
        } else {
          setMessages([
            {
              id: 'welcome',
              role: 'ai',
              content: 'Welcome back! Your chat history is saved to your account. How can I help?',
            },
          ]);
        }
      } catch {
        if (!cancelled) {
          setMessages([
            {
              id: 'welcome',
              role: 'ai',
              content: 'Hi! Ask me anything about SKINAA Link.',
            },
          ]);
        }
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, loggedIn]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const auth = isLoggedIn();
    setLoggedIn(auth);
    setInput('');

    const userMsg: UiMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    };
    const pendingId = `p-${Date.now()}`;
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== 'welcome'),
      userMsg,
      { id: pendingId, role: 'ai', content: '', pending: true },
    ]);
    setLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data } = await api.sendChatMessage(text, auth);
      const answer = await waitForAnswer(data.sessionId, controller.signal);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId ? { id: `a-${Date.now()}`, role: 'ai', content: answer } : m
        )
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not get a reply. Please try again.';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId ? { id: `e-${Date.now()}`, role: 'ai', content: message } : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-900/25 transition hover:scale-105 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-5 z-[80] flex w-[min(100vw-1.5rem,24rem)] flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-soft"
          role="dialog"
          aria-label="SKINAA assistant"
        >
          <div className="flex items-center gap-3 bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <Bot className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold">SKINAA Assistant</p>
              <p className="truncate text-xs text-brand-100">
                {loggedIn ? 'Signed in · chats are saved' : 'Guest · chats are not saved'}
              </p>
            </div>
            <button
              type="button"
              className="rounded-md p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex max-h-[min(60vh,28rem)] min-h-[18rem] flex-col gap-3 overflow-y-auto bg-[linear-gradient(180deg,#f6f7f5_0%,#ffffff_40%)] px-3 py-4"
          >
            {historyLoading ? (
              <div className="flex flex-1 items-center justify-center gap-2 text-sm text-brand-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading history…
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'rounded-br-md bg-brand-600 text-white'
                        : 'rounded-bl-md border border-brand-100 bg-white text-gray-800'
                    }`}
                  >
                    {m.pending ? (
                      <span className="inline-flex items-center gap-2 text-brand-700">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Thinking…
                      </span>
                    ) : (
                      <span className="whitespace-pre-wrap break-words">{m.content}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-brand-100 bg-white p-3"
          >
            <input
              ref={inputRef}
              className="input flex-1 !py-2"
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              maxLength={4000}
              aria-label="Chat message"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-50"
              aria-label="Send"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

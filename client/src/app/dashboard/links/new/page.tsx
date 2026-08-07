'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, LinkItem } from '@/lib/api';

export default function NewLinkPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    alias: '',
    iosUrl: '',
    androidUrl: '',
    fallbackUrl: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.createLink(form as Partial<LinkItem>);
      router.push('/dashboard/links');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-bold text-brand-900">Create smart link</h1>
      <p className="mb-6 text-sm text-gray-500">
        Set destinations for iOS, Android, and desktop fallback.
      </p>

      <form onSubmit={onSubmit} className="card max-w-2xl space-y-5 p-6">
        <div>
          <label className="label">Title *</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Facebook App"
            required
          />
        </div>
        <div>
          <label className="label">Alias * (short code)</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">/l/</span>
            <input
              className="input"
              value={form.alias}
              onChange={(e) =>
                set('alias', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))
              }
              placeholder="demofb"
              required
            />
          </div>
        </div>
        <div>
          <label className="label">iOS / App Store URL *</label>
          <input
            className="input"
            type="url"
            value={form.iosUrl}
            onChange={(e) => set('iosUrl', e.target.value)}
            placeholder="https://apps.apple.com/..."
            required
          />
        </div>
        <div>
          <label className="label">Android / Play Store URL *</label>
          <input
            className="input"
            type="url"
            value={form.androidUrl}
            onChange={(e) => set('androidUrl', e.target.value)}
            placeholder="https://play.google.com/..."
            required
          />
        </div>
        <div>
          <label className="label">Fallback / Desktop URL *</label>
          <input
            className="input"
            type="url"
            value={form.fallbackUrl}
            onChange={(e) => set('fallbackUrl', e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set('isActive', e.target.checked)}
          />
          Active
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Create link'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

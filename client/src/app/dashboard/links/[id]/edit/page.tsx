'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageLoader } from '@/components/Skeleton';
import { api, LinkItem } from '@/lib/api';

export default function EditLinkPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

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
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .getLink(id)
      .then((res) => {
        const l = res.data;
        setForm({
          title: l.title,
          alias: l.alias,
          iosUrl: l.iosUrl,
          androidUrl: l.androidUrl,
          fallbackUrl: l.fallbackUrl,
          isActive: l.isActive,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, [id]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.updateLink(id, form as Partial<LinkItem>);
      router.push('/dashboard/links');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <PageLoader />;

  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-bold text-brand-900">Edit link</h1>
      <form onSubmit={onSubmit} className="card max-w-2xl space-y-5 p-6">
        <div>
          <label className="label">Title *</label>
          <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div>
          <label className="label">Alias *</label>
          <input
            className="input"
            value={form.alias}
            onChange={(e) => set('alias', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
            required
          />
        </div>
        <div>
          <label className="label">iOS URL *</label>
          <input className="input" type="url" value={form.iosUrl} onChange={(e) => set('iosUrl', e.target.value)} required />
        </div>
        <div>
          <label className="label">Android URL *</label>
          <input className="input" type="url" value={form.androidUrl} onChange={(e) => set('androidUrl', e.target.value)} required />
        </div>
        <div>
          <label className="label">Fallback URL *</label>
          <input className="input" type="url" value={form.fallbackUrl} onChange={(e) => set('fallbackUrl', e.target.value)} required />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
          Active
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

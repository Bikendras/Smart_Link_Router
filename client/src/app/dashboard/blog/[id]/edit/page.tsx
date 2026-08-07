'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageLoader } from '@/components/Skeleton';
import { api } from '@/lib/api';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState({
    title: '',
    slug: '',
    featuredImage: '',
    author: '',
    content: '',
    excerpt: '',
    status: 'draft' as 'draft' | 'published',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .getAdminPost(id)
      .then((res) => {
        const p = res.data;
        setForm({
          title: p.title,
          slug: p.slug,
          featuredImage: p.featuredImage || '',
          author: p.author,
          content: p.content,
          excerpt: p.excerpt || '',
          status: p.status,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.updatePost(id, form);
      router.push('/dashboard/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <PageLoader />;

  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-bold text-brand-900">Edit post</h1>
      <form onSubmit={onSubmit} className="card max-w-3xl space-y-4 p-6">
        <div>
          <label className="label">Title *</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="label">Slug *</label>
          <input
            className="input"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Author</label>
            <input
              className="input"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as 'draft' | 'published' }))
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Featured image URL</label>
          <input
            className="input"
            value={form.featuredImage}
            onChange={(e) => setForm((f) => ({ ...f, featuredImage: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Excerpt</label>
          <input
            className="input"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Content (Markdown) *</label>
          <textarea
            className="input min-h-[280px] font-mono text-sm"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            required
          />
        </div>
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

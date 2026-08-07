'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    featuredImage: '',
    author: 'Admin',
    content: '',
    excerpt: '',
    status: 'draft' as 'draft' | 'published',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.createPost(form);
      router.push('/dashboard/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-bold text-brand-900">New blog post</h1>
      <form onSubmit={onSubmit} className="card max-w-3xl space-y-4 p-6">
        <div>
          <label className="label">Title *</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({
                ...f,
                title,
                slug: slugTouched ? f.slug : slugify(title),
              }));
            }}
            required
          />
        </div>
        <div>
          <label className="label">Slug *</label>
          <input
            className="input"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
            }}
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
            type="url"
            value={form.featuredImage}
            onChange={(e) => setForm((f) => ({ ...f, featuredImage: e.target.value }))}
            placeholder="https://..."
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
            placeholder="## Heading&#10;&#10;Write your post in Markdown..."
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Create post'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

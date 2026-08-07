'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { PageLoader } from '@/components/Skeleton';
import { api, BlogPost } from '@/lib/api';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    let cancelled = false;
    api
      .getAdminPosts()
      .then((res) => {
        if (!cancelled) setPosts(res.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onDelete(id: string) {
    if (!confirm('Delete this post?')) return;
    await api.deletePost(id);
    setPosts((p) => p.filter((x) => x._id !== id));
  }

  if (loading) return <PageLoader />;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-900">Blog CMS</h1>
          <p className="text-sm text-gray-500">Create, edit, publish, and delete posts.</p>
        </div>
        <Link href="/dashboard/blog/new" className="btn-primary">
          <Plus size={16} /> New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="card px-4 py-10 text-center text-gray-500">
          No posts yet. Create your first blog post.
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {posts.map((post) => (
              <div key={post._id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-brand-900">{post.title}</p>
                    <p className="mt-1 truncate text-sm text-gray-500">{post.slug}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Updated {new Date(post.updatedAt).toLocaleDateString()}
                </p>
                <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                  <Link href={`/dashboard/blog/${post._id}/edit`} className="btn-ghost">
                    <Pencil size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(post._id)}
                    className="btn-ghost text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50 text-xs uppercase text-brand-800">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{post.title}</td>
                    <td className="px-4 py-3 text-gray-500">{post.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/blog/${post._id}/edit`} className="btn-ghost">
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDelete(post._id)}
                          className="btn-ghost text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

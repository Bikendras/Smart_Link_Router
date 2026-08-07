'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { PageLoader } from '@/components/Skeleton';
import { api, LinkItem } from '@/lib/api';

export default function AdminLinksPage() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    let cancelled = false;
    (async () => {
      try {
        const res = await api.getLinks();
        if (!cancelled) setLinks(res.data);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load');
        if (String(err).includes('Unauthorized')) router.push('/dashboard/login');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onDelete(id: string) {
    if (!confirm('Delete this link and its analytics?')) return;
    await api.deleteLink(id);
    setLinks((prev) => prev.filter((l) => l._id !== id));
  }

  if (loading) return <PageLoader />;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-900">My Links</h1>
          <p className="text-sm text-gray-500">Create and manage smart multi-platform short links.</p>
        </div>
        <Link href="/dashboard/links/new" className="btn-primary">
          <Plus size={16} /> Create link
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {links.length === 0 ? (
        <div className="card px-4 py-10 text-center text-gray-500">
          No links yet. Create your first smart link.
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {links.map((link) => (
              <div key={link._id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-brand-900">{link.title}</p>
                    <a
                      href={api.shortLinkUrl(link.alias)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                    >
                      /l/{link.alias} <ExternalLink size={12} />
                    </a>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      link.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {link.isActive ? 'Active' : 'Off'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{link.clickCount ?? 0} clicks</p>
                <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
                  <Link
                    href={`/dashboard/links/${link._id}/analytics`}
                    className="btn-ghost text-brand-700"
                    title="Analytics"
                  >
                    <BarChart3 size={16} />
                  </Link>
                  <Link
                    href={`/dashboard/links/${link._id}/edit`}
                    className="btn-ghost text-brand-700"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(link._id)}
                    className="btn-ghost text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50 text-xs uppercase tracking-wide text-brand-800">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Alias</th>
                  <th className="px-4 py-3">Clicks</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {links.map((link) => (
                  <tr key={link._id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3 font-medium text-brand-900">{link.title}</td>
                    <td className="px-4 py-3">
                      <a
                        href={api.shortLinkUrl(link.alias)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-brand-600 hover:underline"
                      >
                        /l/{link.alias} <ExternalLink size={12} />
                      </a>
                    </td>
                    <td className="px-4 py-3">{link.clickCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          link.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {link.isActive ? 'Active' : 'Off'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/links/${link._id}/analytics`}
                          className="btn-ghost text-brand-700"
                          title="Analytics"
                        >
                          <BarChart3 size={16} />
                        </Link>
                        <Link
                          href={`/dashboard/links/${link._id}/edit`}
                          className="btn-ghost text-brand-700"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDelete(link._id)}
                          className="btn-ghost text-red-600"
                          title="Delete"
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

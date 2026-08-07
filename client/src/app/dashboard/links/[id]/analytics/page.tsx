'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageLoader } from '@/components/Skeleton';
import { api, AnalyticsData } from '@/lib/api';

const COLORS = ['#2d6a3e', '#5aa56d', '#8cc49a'];

export default function LinkAnalyticsPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getAnalytics(id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (error || !data) return <p className="text-red-600">{error || 'Not found'}</p>;


  const pieData = [
    { name: 'iOS', value: data.platformStats.ios },
    { name: 'Android', value: data.platformStats.android },
    { name: 'Desktop', value: data.platformStats.desktop },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">
            <Link href="/dashboard/links" className="text-brand-600 hover:underline">
              ← Links
            </Link>
          </p>
          <h1 className="font-display text-2xl font-bold text-brand-900">
            Analytics — {data.link.title}
          </h1>
          <p className="text-sm text-gray-500">/l/{data.link.alias}</p>
        </div>
        <a
          href={api.shortLinkUrl(data.link.alias)}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          Open short link
        </a>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs uppercase text-gray-400">Total clicks</p>
          <p className="mt-1 font-display text-3xl font-bold text-brand-800">{data.totalClicks}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-gray-400">iOS</p>
          <p className="mt-1 font-display text-3xl font-bold text-brand-700">
            {data.platformStats.ios}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-gray-400">Android</p>
          <p className="mt-1 font-display text-3xl font-bold text-brand-700">
            {data.platformStats.android}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-gray-400">Desktop</p>
          <p className="mt-1 font-display text-3xl font-bold text-brand-700">
            {data.platformStats.desktop}
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-4 font-display text-lg font-semibold text-brand-900">
            Clicks over time
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2d6a3e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h2 className="mb-4 font-display text-lg font-semibold text-brand-900">
            Platform distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="font-display text-lg font-semibold text-brand-900">Recent clicks</h2>
        </div>

        <div className="divide-y divide-gray-100 md:hidden">
          {data.recentClicks.length === 0 && (
            <p className="px-4 py-8 text-center text-gray-400">
              No clicks yet — open the short link to generate events.
            </p>
          )}
          {data.recentClicks.map((c, i) => (
            <div key={i} className="space-y-1 px-4 py-3 text-sm">
              <p className="font-medium text-brand-900">{new Date(c.timestamp).toLocaleString()}</p>
              <p className="text-gray-600">
                <span className="capitalize">{c.os}</span>
                {c.device ? ` · ${c.device}` : ''} · {c.country}
              </p>
              <p className="truncate text-xs text-gray-400">{c.ip}</p>
              <p className="truncate text-xs text-gray-400">{c.referrer || '—'}</p>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">OS</th>
                <th className="px-4 py-2">Device</th>
                <th className="px-4 py-2">IP</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Referrer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.recentClicks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No clicks yet — open the short link to generate events.
                  </td>
                </tr>
              )}
              {data.recentClicks.map((c, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">{new Date(c.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 capitalize">{c.os}</td>
                  <td className="px-4 py-2 capitalize">{c.device || '—'}</td>
                  <td className="px-4 py-2">{c.ip}</td>
                  <td className="px-4 py-2">{c.country}</td>
                  <td className="max-w-[200px] truncate px-4 py-2 text-gray-500">
                    {c.referrer || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

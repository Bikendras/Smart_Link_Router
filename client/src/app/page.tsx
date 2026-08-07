'use client';

import Link from 'next/link';
import { Check, Smartphone, BarChart3, Zap } from 'lucide-react';
import DemoRotator from '@/components/DemoRotator';

const features = [
  'Smart device detection',
  'Dynamic link and QR code',
  'Realtime click analytics',
  'Blog CMS included',
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-brand-50 to-brand-100/60">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-brand-300/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-brand-950 md:text-5xl">
              <span className="text-brand-600">One</span> link to
              <br />
              all app stores
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600 md:text-lg">
              Stop using multiple links and QR codes. Get one universal link that works across
              Apple App Store, Google Play, and the web.
            </p>
            <ul className="mt-6 space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard/signup" className="btn-primary px-6 py-3 text-base">
                Sign up now — Start free
              </Link>
              <Link href="/blog" className="btn-secondary px-6 py-3 text-base">
                Read the blog
              </Link>
            </div>
          </div>

          <DemoRotator />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl font-bold text-brand-900">
            How SKINAA Link solves this
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-gray-600">
            Smart routing detects the visitor device and redirects to the right store instantly.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Zap,
                step: '1',
                title: 'User clicks your link',
                desc: 'Or scans your QR code from any campaign.',
              },
              {
                icon: Smartphone,
                step: '2',
                title: 'We detect their device',
                desc: 'iPhone, Android, or desktop — we pick the right destination.',
              },
              {
                icon: BarChart3,
                step: '3',
                title: 'Redirect + track',
                desc: 'Instant redirect, with click stats saved in the background.',
              },
            ].map((item) => (
              <div key={item.step} className="card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <item.icon size={22} />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-500">
                  Step {item.step}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-brand-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-700 py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl font-bold">Ready to simplify app distribution?</h2>
          <p className="mt-3 text-brand-100">
            Create smart links, view analytics, and publish blog posts — all in one stack.
          </p>
          <Link
            href="/dashboard/signup"
            className="mt-6 inline-flex rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-800 hover:bg-brand-50"
          >
            Create your first link
          </Link>
        </div>
      </section>
    </div>
  );
}

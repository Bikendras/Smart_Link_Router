'use client';

import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '@/lib/api';

const DEMOS = [
  {
    brand: 'Facebook',
    alias: 'demofb',
    desktopName: 'Facebook website',
  },
  {
    brand: 'BBC',
    alias: 'demobbc',
    desktopName: 'BBC website',
  },
  {
    brand: 'Spotify',
    alias: 'spotify',
    desktopName: 'Spotify website',
  },
];

const INTERVAL_MS = 5000;

export default function DemoRotator() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const start = Date.now();
    let done = false;
    const tick = window.setInterval(() => {
      if (done) return;
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / INTERVAL_MS) * 100));
      if (elapsed >= INTERVAL_MS) {
        done = true;
        setProgress(0);
        setIndex((i) => (i + 1) % DEMOS.length);
      }
    }, 40);

    return () => window.clearInterval(tick);
  }, [index, paused]);

  const demo = DEMOS[index];
  const url = api.shortLinkUrl(demo.alias);
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="card relative mx-auto w-full max-w-md p-6 pb-10 text-center shadow-soft">
      <h2 className="font-display text-lg font-semibold text-brand-900">
        See Smart App Links in Action
      </h2>
      <p className="mt-1 text-sm text-gray-500 transition-opacity duration-300">
        Test a demo link for{' '}
        <em key={demo.brand} className="font-medium italic text-brand-700">
          {demo.brand}
        </em>
      </p>

      <div
        key={demo.alias}
        className="mx-auto mt-5 flex justify-center rounded-lg bg-white p-3 transition-opacity duration-300"
      >
        <QRCodeSVG value={url} size={180} fgColor="#21452c" />
      </div>

      <a
        href={url}
        className="mt-4 inline-block break-all text-sm font-medium text-brand-600 hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        {url}
      </a>

      <p className="mt-2 text-xs text-gray-500">Scan with your phone or click the link</p>

      <p className="mt-3 px-1 text-xs leading-relaxed text-gray-500">
        Automatically detects your device and takes you to the right place — iPhone users see App
        Store, Android users see Google Play, desktop users see the{' '}
        <strong className="font-medium text-gray-700">{demo.desktopName}</strong>.
      </p>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="absolute bottom-2.5 right-2.5 z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-brand-100 transition hover:scale-105"
        aria-label={paused ? 'Play demo rotation' : 'Pause demo rotation'}
        title={paused ? 'Play' : 'Pause'}
      >
        <svg className="absolute h-7 w-7 -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="#dceee0"
            strokeWidth="3.5"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="#2d6a3e"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-75 ease-linear"
          />
        </svg>
        <span className="relative z-10 text-brand-700">
          {paused ? <Play size={10} fill="currentColor" /> : <Pause size={10} fill="currentColor" />}
        </span>
      </button>
    </div>
  );
}

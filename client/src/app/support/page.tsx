'use client';

import { useState } from 'react';

const faqs: Record<string, { q: string; a: string }[]> = {
  'What is a smart link': [
    {
      q: 'What is a smart download link?',
      a: 'A single short URL that detects the visitor device (iOS / Android / Desktop) and redirects to the matching destination.',
    },
    {
      q: 'What is a short link?',
      a: 'A compact alias like /l/demofb that points to your multi-platform destinations.',
    },
    {
      q: 'How does OS detection work?',
      a: 'We parse the User-Agent header on each request and issue a 302 redirect to the correct store or fallback URL.',
    },
  ],
  'Working with links': [
    {
      q: 'How do I create a link?',
      a: 'Open Admin → Create Link, set an alias, then provide iOS, Android, and Fallback URLs.',
    },
    {
      q: 'How do I test redirects?',
      a: 'Open your short link, then use Chrome DevTools device mode or User-Agent override to simulate iPhone, Android, and desktop.',
    },
    {
      q: 'Are clicks tracked?',
      a: 'Yes. Each click stores time, device, referrer, and country when available — without delaying the redirect.',
    },
  ],
  Analytics: [
    {
      q: 'Where do I see statistics?',
      a: 'Open any link in Admin and click Analytics for totals, platform breakdown, and a daily time-series chart.',
    },
  ],
  Blog: [
    {
      q: 'How does the blog CMS work?',
      a: 'Admins can create Markdown posts as Draft or Published. Only published posts appear on /blog.',
    },
  ],
};

const categories = Object.keys(faqs);

export default function SupportPage() {
  const [active, setActive] = useState(categories[0]);
  const [openQ, setOpenQ] = useState<string | null>(null);

  return (
    <div>
      <section className="bg-brand-700 px-4 py-12 text-center text-white">
        <h1 className="font-display text-4xl font-bold">Support and FAQ</h1>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActive(cat);
                setOpenQ(null);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active === cat
                  ? 'bg-white text-brand-800'
                  : 'bg-brand-800/50 text-brand-50 hover:bg-brand-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="mb-6 text-center font-display text-2xl font-semibold text-gray-400">
          {active}
        </h2>
        <div className="card divide-y divide-gray-100 overflow-hidden">
          {faqs[active].map((item) => (
            <button
              key={item.q}
              type="button"
              onClick={() => setOpenQ(openQ === item.q ? null : item.q)}
              className="block w-full px-5 py-4 text-left transition hover:bg-gray-50"
            >
              <p className="font-medium text-brand-900">{item.q}</p>
              {openQ === item.q && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.a}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

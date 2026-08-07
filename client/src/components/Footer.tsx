'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard')) return null;

  return (
    <footer className="mt-auto bg-brand-950 text-brand-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-white">
            skinaa<span className="text-brand-300">.link</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-brand-200">
            Simplify app downloads with one smart link to all app stores.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-brand-300">
            <Link href="/support" className="hover:text-white">
              Support
            </Link>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
          </div>
        </div>
        <div className="text-sm text-brand-300 md:text-right">
          <p>
            Contact{' '}
            <a href="mailto:hello@skinaa.link" className="text-brand-100 hover:text-white">
              hello@skinaa.link
            </a>
          </p>
          <p className="mt-2 text-xs">© {new Date().getFullYear()} SKINAA Smart Link Router</p>
        </div>
      </div>
    </footer>
  );
}

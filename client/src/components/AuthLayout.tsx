'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
  title = 'One Link',
  subtitle = 'Multiple Destinations',
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const isLogin = pathname.includes('/login');

  return (
    <div className="flex min-h-screen flex-col bg-brand-700">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-display text-xl font-bold text-white">
            skinaa<span className="text-brand-200">.link</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-brand-100 md:flex">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
            <Link href="/support" className="hover:text-white">
              Support
            </Link>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/login"
              className={`text-sm font-medium ${isLogin ? 'text-white' : 'text-brand-100 hover:text-white'}`}
            >
              Log in
            </Link>
            <Link
              href="/dashboard/signup"
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-10 px-4 py-12 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="text-center md:max-w-md md:text-left">
          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            {title}
            <br />
            <span className="text-brand-200/90">{subtitle}</span>
          </h1>
          <p className="mt-4 text-sm text-brand-100 md:text-base">
            Create smart links that detect iOS, Android, and Desktop — then route users to the right
            store instantly.
          </p>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </div>

      <footer className="border-t border-white/10 py-4 text-center text-xs text-brand-200">
        © {new Date().getFullYear()} SKINAA Smart Link Router
      </footer>
    </div>
  );
}

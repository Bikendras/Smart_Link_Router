'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { clearSession, getUser, isLoggedIn } from '@/lib/auth';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/support', label: 'Support' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userLabel, setUserLabel] = useState('');
  const isAdmin = pathname.startsWith('/dashboard');

  useEffect(() => {
    const ok = isLoggedIn();
    setLoggedIn(ok);
    if (ok) {
      const u = getUser();
      setUserLabel(u?.name || u?.email || '');
    } else {
      setUserLabel('');
    }
  }, [pathname]);

  function logout() {
    clearSession();
    setLoggedIn(false);
    setUserLabel('');
    setOpen(false);
    router.push('/');
  }

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-brand-800/20 bg-brand-700 text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-white">
          skinaa<span className="text-brand-200">.link</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition ${
                pathname === item.href ? 'text-white' : 'text-brand-100 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <>
              {userLabel && (
                <span className="max-w-[140px] truncate text-sm text-brand-100">{userLabel}</span>
              )}
              <Link
                href="/dashboard/links"
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-sm font-medium text-brand-100 hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/dashboard/login"
                className="text-sm font-medium text-brand-100 hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/dashboard/signup"
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-600 bg-brand-800 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-brand-50"
              >
                {item.label}
              </Link>
            ))}
            {loggedIn ? (
              <>
                <Link
                  href="/dashboard/links"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-fit bg-white text-brand-800 hover:bg-brand-50"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="w-fit text-sm text-brand-100"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/login"
                  onClick={() => setOpen(false)}
                  className="text-sm text-brand-100"
                >
                  Log in
                </Link>
                <Link
                  href="/dashboard/signup"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-fit bg-white text-brand-800 hover:bg-brand-50"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

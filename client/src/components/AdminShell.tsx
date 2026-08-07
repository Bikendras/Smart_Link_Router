'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { clearSession, getUser } from '@/lib/auth';

const items = [
  { href: '/dashboard/links', label: 'My Links', icon: Link2 },
  { href: '/dashboard/links/new', label: 'Create Link', icon: Plus },
  { href: '/dashboard/blog', label: 'Blog CMS', icon: FileText },
  { href: '/dashboard/blog/new', label: 'New Post', icon: LayoutDashboard },
  { href: '/dashboard/settings', label: 'Account Settings', icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href === '/dashboard/links') {
    return pathname.startsWith('/dashboard/links/') && !pathname.includes('/new');
  }
  if (href === '/dashboard/blog') {
    return pathname.startsWith('/dashboard/blog/') && !pathname.includes('/new');
  }
  if (href === '/dashboard/settings') {
    return pathname.startsWith('/dashboard/settings');
  }
  return false;
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            onClick={onNavigate}
            className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition ${
              active
                ? 'bg-brand-100 text-brand-800'
                : 'text-gray-600 hover:bg-gray-50 hover:text-brand-700'
            }`}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
      <div className="my-3 border-t border-gray-100" />
      <p className="px-3 text-xs leading-relaxed text-gray-400">
        Open analytics from each link&apos;s chart icon.
      </p>
      <span className="mt-1 flex items-center gap-2 px-3 text-xs text-gray-400">
        <BarChart3 size={14} /> Per-link analytics
      </span>
    </nav>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userLabel, setUserLabel] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const u = getUser();
    setUserLabel(u?.name || u?.email || '');
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function logout() {
    clearSession();
    router.push('/dashboard/login');
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f3f5f2]">
        <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-brand-800/10 bg-white lg:flex">
          <div className="flex h-14 items-center border-b border-gray-100 px-4">
            <Link href="/dashboard/links" className="font-display text-lg font-bold text-brand-800">
              skinaa<span className="text-brand-500">.link</span>
            </Link>
          </div>
          <p className="px-4 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Dashboard
          </p>
          <SidebarNav pathname={pathname} />
        </aside>

        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-brand-800/10 bg-white shadow-xl transition-transform duration-200 lg:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
            <Link href="/dashboard/links" className="font-display text-lg font-bold text-brand-800">
              skinaa<span className="text-brand-500">.link</span>
            </Link>
            <button
              type="button"
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
          <p className="px-4 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Dashboard
          </p>
          <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-brand-800/10 bg-brand-700 px-4 text-white sm:px-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md p-1.5 hover:bg-brand-600 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <p className="font-display text-sm font-semibold tracking-wide text-brand-50">
                Dashboard
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {userLabel && (
                <span className="hidden max-w-[120px] truncate items-center gap-1.5 text-sm text-brand-100 sm:inline-flex">
                  <User size={14} /> {userLabel}
                </span>
              )}
              <Link href="/" className="text-sm text-brand-100 hover:text-white">
                Public site
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-white hover:bg-brand-600"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-5 md:p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}

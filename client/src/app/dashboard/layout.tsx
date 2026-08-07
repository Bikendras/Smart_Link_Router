'use client';

import { usePathname } from 'next/navigation';
import AdminShell from '@/components/AdminShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith('/dashboard/login') || pathname.startsWith('/dashboard/signup');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}

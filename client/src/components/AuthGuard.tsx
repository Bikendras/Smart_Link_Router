'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/Skeleton';
import { isLoggedIn } from '@/lib/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/dashboard/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f5f2]">
        <PageLoader />
      </div>
    );
  }

  return <>{children}</>;
}

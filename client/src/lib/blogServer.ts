import type { BlogPost } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts/public`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    // Offline API / Vercel build: never crash the page or build
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/api/posts/public/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

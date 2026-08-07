import type { BlogPost } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${API_URL}/api/posts/public`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_URL}/api/posts/public/${encodeURIComponent(slug)}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}

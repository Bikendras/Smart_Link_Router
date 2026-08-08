import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchPublishedPosts } from '@/lib/blogServer';

/** Always fetch at request time — avoids Vercel build needing a live API. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog | SKINAA Link',
  description: 'Guides on smart links, device redirects, and click analytics.',
};

export default async function BlogListingPage() {
  const posts = await fetchPublishedPosts();

  return (
    <div>
      <section className="bg-brand-700 px-4 py-14 text-center text-white">
        <h1 className="font-display text-4xl font-bold">Blog</h1>
        <p className="mt-3 text-brand-100">Guides on smart links, redirects, and analytics.</p>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {posts.length === 0 && (
          <p className="text-center text-gray-500">No published posts yet.</p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="aspect-[16/10] overflow-hidden bg-brand-100">
                {post.featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-brand-400">
                    SKINAA
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs text-gray-400">
                  {post.author}
                  {post.publishedAt
                    ? ` · ${new Date(post.publishedAt).toLocaleDateString()}`
                    : ''}
                </p>
                <h2 className="mt-2 font-display text-lg font-semibold text-brand-900 group-hover:text-brand-600">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                  {post.excerpt || 'Read more…'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

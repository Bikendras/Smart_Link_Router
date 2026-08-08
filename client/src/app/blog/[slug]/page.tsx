import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogMarkdown from '@/components/BlogMarkdown';
import { fetchPostBySlug } from '@/lib/blogServer';

/** Always fetch at request time — avoids Vercel build needing a live API. */
export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post not found | SKINAA Link' };
  }
  return {
    title: `${post.title} | SKINAA Link`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featuredImage ? [post.featuredImage] : undefined,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await fetchPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article>
      <div className="bg-brand-700 px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm text-brand-200 hover:text-white">
            ← Blog
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">{post.title}</h1>
          <p className="mt-3 text-sm text-brand-100">
            By {post.author}
            {post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString()}` : ''}
          </p>
        </div>
      </div>

      {post.featuredImage && (
        <div className="mx-auto max-w-3xl px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImage}
            alt={post.title}
            className="mt-8 aspect-[21/9] w-full rounded-xl object-cover shadow-soft"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-10">
        <BlogMarkdown content={post.content} />
      </div>
    </article>
  );
}

import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-brand-900">Post not found</h1>
      <p className="mt-2 text-gray-500">This post may be a draft or the slug is wrong.</p>
      <Link href="/blog" className="mt-4 inline-block text-brand-600 hover:underline">
        ← Back to blog
      </Link>
    </div>
  );
}

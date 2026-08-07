'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { BlogPost } from '@/lib/api';

export default function BlogMarkdown({ content }: { content: string }) {
  return (
    <div className="prose-blog">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

export type { BlogPost };

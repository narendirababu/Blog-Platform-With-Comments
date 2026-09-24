import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/types';
import { COVER_COLORS } from '@/lib/constants';
import { formatDate, readingTime } from '@/lib/format';

interface Props {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: Props) {
  const color = COVER_COLORS[post.cover_color] ?? COVER_COLORS.ocean;

  if (featured) {
    return (
      <Link
        to={`/post/${post.id}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-0.5 md:flex-row"
      >
        <div className={`relative h-56 bg-gradient-to-br ${color.bg} md:h-auto md:w-2/5`}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 0%, transparent 50%)' }} />
          <span className="absolute left-5 top-5 rounded-full bg-white/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            {post.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-7">
          <p className="mb-3 text-xs font-medium text-stone-500">{formatDate(post.created_at)} · {readingTime(post.body)}</p>
          <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-stone-900 transition-colors group-hover:text-stone-700">
            {post.title}
          </h2>
          <p className="mb-5 flex-1 text-[15px] leading-relaxed text-stone-600">{post.excerpt}</p>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-stone-900">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/post/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className={`relative h-40 bg-gradient-to-br ${color.bg}`}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 0%, transparent 50%)' }} />
        <span className="absolute left-4 top-4 rounded-full bg-white/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 text-xs font-medium text-stone-500">{formatDate(post.created_at)} · {readingTime(post.body)}</p>
        <h3 className="mb-2 text-lg font-bold leading-snug tracking-tight text-stone-900 transition-colors group-hover:text-stone-700">
          {post.title}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-stone-600 line-clamp-2">{post.excerpt}</p>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-stone-900">
          Read
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

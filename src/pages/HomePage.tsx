import { useEffect, useState } from 'react';
import type { Post } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import PostCard from '@/components/PostCard';
import { CATEGORIES } from '@/lib/constants';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  useEffect(() => {
    const fetch = async () => {
      let q = supabase.from('posts').select('*').eq('published', true).order('created_at', { ascending: false });
      if (category !== 'All') q = q.eq('category', category);
      if (query.trim()) q = q.ilike('title', `%${query.trim()}%`);
      const { data, error } = await q;
      if (!error && data) setPosts(data as Post[]);
      setLoading(false);
    };
    const t = setTimeout(fetch, 200);
    return () => clearTimeout(t);
  }, [query, category]);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div>
      <section className="mx-auto max-w-5xl px-5 pt-14 pb-8 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">A place for ideas worth keeping</p>
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Read. Reflect. <span className="text-stone-400">Respond.</span>
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-stone-600">
          Margin is a minimal blog platform for thoughtful writing and conversations. Browse articles, share your perspective, and publish your own stories.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-lg border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('All')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                category === 'All' ? 'bg-stone-900 text-stone-50' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  category === cat ? 'bg-stone-900 text-stone-50' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-stone-100" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-20 text-center">
            <p className="text-sm text-stone-500">No articles found. {query || category !== 'All' ? 'Try a different search or filter.' : 'Be the first to write one!'}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {featured && <PostCard post={featured} featured />}
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

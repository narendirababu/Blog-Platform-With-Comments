import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, FileText } from 'lucide-react';
import type { Post } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { COVER_COLORS } from '@/lib/constants';
import { formatDate } from '@/lib/format';

export default function ProfilePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setPosts(data as Post[]);
      setLoading(false);
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Sign in to view your profile</h1>
        <Link to="/signin" className="mt-4 inline-block rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-50">Sign in</Link>
      </div>
    );
  }

  const published = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="flex items-center gap-4 border-b border-stone-200 pb-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900 text-2xl font-bold uppercase text-stone-50">
          {user.email?.[0] ?? 'U'}
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">{user.email}</h1>
          <p className="mt-1 text-sm text-stone-500">{published.length} published · {drafts.length} drafts</p>
        </div>
        <Link to="/editor" className="ml-auto flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800">
          <PenLine className="h-4 w-4" /> Write
        </Link>
      </div>

      <section className="py-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">Your articles</h2>
        {loading ? (
          <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-stone-100" />)}</div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-12 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-stone-400" />
            <p className="text-sm text-stone-500">You haven't written anything yet.</p>
            <Link to="/editor" className="mt-4 inline-block rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-stone-50">Write your first article</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => {
              const color = COVER_COLORS[p.cover_color] ?? COVER_COLORS.ocean;
              return (
                <Link
                  key={p.id}
                  to={`/post/${p.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 transition-all hover:shadow-md"
                >
                  <span className={`h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${color.bg}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-stone-900 group-hover:text-stone-700">{p.title}</p>
                    <p className="text-xs text-stone-400">{formatDate(p.created_at)} · {p.category}</p>
                  </div>
                  {!p.published && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">Draft</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

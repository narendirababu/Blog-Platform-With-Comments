import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Trash2, Pencil } from 'lucide-react';
import type { Post, Comment } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { COVER_COLORS } from '@/lib/constants';
import { formatDate, readingTime } from '@/lib/format';
import CommentItem, { CommentComposer } from '@/components/CommentItem';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadComments = async () => {
    if (!id) return;
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    if (data) setComments(data as Comment[]);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPost(data as Post);
      setLoading(false);
      loadComments();
    })();
  }, [id]);

  const deletePost = async () => {
    if (!post) return;
    await supabase.from('posts').delete().eq('id', post.id);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="h-8 w-24 animate-pulse rounded bg-stone-200" />
        <div className="mt-8 h-12 animate-pulse rounded bg-stone-200" />
        <div className="mt-4 h-4 animate-pulse rounded bg-stone-100" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Article not found</h1>
        <p className="mt-2 text-stone-600">This article may have been removed or is not yet published.</p>
        <Link to="/" className="mt-6 inline-block rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-50">
          Back to home
        </Link>
      </div>
    );
  }

  const color = COVER_COLORS[post.cover_color] ?? COVER_COLORS.ocean;
  const isOwner = user?.id === post.author_id;

  const paragraphs = post.body.split('\n').filter((p) => p.trim());

  return (
    <article>
      <div className={`h-48 bg-gradient-to-br ${color.bg} sm:h-64`}>
        <div className="mx-auto max-w-3xl px-5 pt-6">
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-10">
        <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-600">
          {post.category}
        </span>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-stone-500">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.created_at)}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{readingTime(post.body)}</span>
        </div>

        {isOwner && (
          <div className="mt-5 flex gap-2 border-b border-stone-200 pb-5">
            <Link to={`/editor/${post.id}`} className="flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Link>
            <button onClick={deletePost} className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}

        <div className="mt-8 space-y-5">
          <p className="text-lg font-medium leading-relaxed text-stone-700">{post.excerpt}</p>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[15px] leading-[1.8] text-stone-700">{p}</p>
          ))}
        </div>

        <section className="mt-14 border-t border-stone-200 pt-8">
          <h2 className="mb-5 text-xl font-bold text-stone-900">
            Comments <span className="ml-1 text-sm font-normal text-stone-400">({comments.length})</span>
          </h2>
          <div className="space-y-4">
            <CommentComposer postId={post.id} onChanged={loadComments} />
            {comments.length === 0 ? (
              <p className="py-6 text-center text-sm text-stone-400">No comments yet. Start the conversation.</p>
            ) : (
              comments.map((c) => <CommentItem key={c.id} comment={c} onChanged={loadComments} />)
            )}
          </div>
        </section>
      </div>
    </article>
  );
}

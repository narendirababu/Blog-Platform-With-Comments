import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Eye } from 'lucide-react';
import type { Post } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES, COVER_COLORS, COVER_COLOR_KEYS } from '@/lib/constants';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [coverColor, setCoverColor] = useState('ocean');
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
      if (data) {
        const p = data as Post;
        if (p.author_id !== user?.id) { navigate(`/post/${id}`); return; }
        setTitle(p.title);
        setExcerpt(p.excerpt);
        setBody(p.body);
        setCategory(p.category);
        setCoverColor(p.cover_color);
        setPublished(p.published);
      }
      setLoading(false);
    })();
  }, [id, user, navigate]);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Sign in to write</h1>
        <p className="mt-2 text-stone-600">You need an account to create or edit articles.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="mx-auto max-w-2xl px-5 py-10"><div className="h-8 w-32 animate-pulse rounded bg-stone-200" /></div>;
  }

  const save = async () => {
    if (!title.trim()) { setError('Give your article a title.'); return; }
    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim() || title.trim(),
      body: body.trim(),
      category,
      cover_color: coverColor,
      published,
    };

    if (id) {
      const { error } = await supabase.from('posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) setError(error.message);
      else navigate(`/post/${id}`);
    } else {
      const { data, error } = await supabase.from('posts').insert(payload).select().single();
      if (error) setError(error.message);
      else navigate(`/post/${data.id}`);
    }
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">{id ? 'Edit article' : 'New article'}</h1>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={160}
            placeholder="A compelling headline"
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-lg font-medium text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Excerpt</label>
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={320}
            placeholder="A short summary shown on cards"
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            placeholder="Write your article. Use blank lines to separate paragraphs."
            className="w-full resize-y rounded-lg border border-stone-300 bg-white px-4 py-3 text-[15px] leading-relaxed text-stone-800 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Cover color</label>
            <div className="flex flex-wrap gap-2">
              {COVER_COLOR_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCoverColor(key)}
                  className={`h-9 w-9 rounded-lg bg-gradient-to-br ${COVER_COLORS[key].bg} transition-all ${coverColor === key ? 'ring-2 ring-stone-900 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                  aria-label={COVER_COLORS[key].label}
                />
              ))}
            </div>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`relative h-6 w-11 rounded-full transition-colors ${published ? 'bg-stone-900' : 'bg-stone-300'}`}
          >
            <span className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform ${published ? 'translate-x-5' : 'translate-x-0.5'}`}>
              {published && <Check className="h-3 w-3 text-stone-900" />}
            </span>
          </button>
          <span className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
            <Eye className="h-4 w-4 text-stone-400" />
            {published ? 'Visible to everyone' : 'Draft — only you can see it'}
          </span>
        </label>

        {error && <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-semibold text-stone-50 shadow-sm transition-all hover:bg-stone-800 hover:shadow-md disabled:opacity-50"
          >
            {saving ? 'Saving…' : id ? 'Save changes' : 'Publish article'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

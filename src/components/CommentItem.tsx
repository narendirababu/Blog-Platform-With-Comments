import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import type { Comment } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { relativeTime } from '@/lib/format';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  comment: Comment;
  onChanged: () => void;
}

export default function CommentItem({ comment, onChanged }: Props) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.body);
  const [saving, setSaving] = useState(false);

  const isOwner = user?.id === comment.author_id;

  const saveEdit = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from('comments')
      .update({ body: draft.trim(), updated_at: new Date().toISOString() })
      .eq('id', comment.id);
    setSaving(false);
    if (!error) {
      setEditing(false);
      onChanged();
    }
  };

  const deleteComment = async () => {
    const { error } = await supabase.from('comments').delete().eq('id', comment.id);
    if (!error) onChanged();
  };

  return (
    <div className="group rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-stone-300">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-xs font-bold uppercase text-stone-50">
          {comment.author_id.slice(0, 2)}
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-stone-700">
            {isOwner ? 'You' : `Reader ${comment.author_id.slice(0, 4)}`}
          </span>
          <span className="text-xs text-stone-400">{relativeTime(comment.created_at)}</span>
        </div>
        {isOwner && !editing && (
          <div className="ml-auto flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setEditing(true)}
              className="rounded-md px-2 py-1 text-xs font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            >
              Edit
            </button>
            <button
              onClick={deleteComment}
              className="rounded-md px-2 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {editing ? (
        <div className="mt-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-800 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={saveEdit}
              disabled={saving || !draft.trim()}
              className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-stone-50 transition-colors hover:bg-stone-800 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => { setEditing(false); setDraft(comment.body); }}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-stone-700">{comment.body}</p>
      )}
    </div>
  );
}

export function CommentComposer({ postId, onChanged }: { postId: string; onChanged: () => void }) {
  const { user } = useAuth();
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!body.trim()) return;
    setPosting(true);
    setError(null);
    const { error } = await supabase
      .from('comments')
      .insert({ post_id: postId, body: body.trim() });
    setPosting(false);
    if (error) {
      setError(error.message);
    } else {
      setBody('');
      onChanged();
    }
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5 text-center">
        <MessageSquare className="mx-auto mb-2 h-6 w-6 text-stone-400" />
        <p className="text-sm text-stone-600">
          <Link to="/signin" className="font-semibold text-stone-900 underline">Sign in</Link> to join the conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-xs font-bold uppercase text-stone-50">
          {user.email?.[0] ?? 'U'}
        </span>
        <span className="text-sm font-medium text-stone-700">Share your thoughts…</span>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="Write a thoughtful comment"
        className="w-full resize-none rounded-lg border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
      />
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-stone-400">{body.length}/1000</span>
        <button
          onClick={submit}
          disabled={posting || !body.trim()}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800 disabled:opacity-50"
        >
          {posting ? 'Posting…' : 'Post comment'}
        </button>
      </div>
    </div>
  );
}

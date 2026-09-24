import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PenLine } from 'lucide-react';

export default function AuthPage({ mode }: { mode: 'signin' | 'signup' }) {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isSignUp = mode === 'signup';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fn = isSignUp ? signUp : signIn;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    navigate('/');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-stone-900 text-stone-50">
            <PenLine className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-1.5 text-sm text-stone-500">
            {isSignUp ? 'Start writing and join the conversation.' : 'Sign in to write and comment.'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>
          {error && <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-stone-900 px-4 py-3 text-sm font-semibold text-stone-50 shadow-sm transition-all hover:bg-stone-800 hover:shadow-md disabled:opacity-50"
          >
            {busy ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          {isSignUp ? (
            <>Already have an account? <Link to="/signin" className="font-semibold text-stone-900 underline">Sign in</Link></>
          ) : (
            <>New here? <Link to="/signup" className="font-semibold text-stone-900 underline">Create an account</Link></>
          )}
        </p>
      </div>
    </div>
  );
}

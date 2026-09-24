import { Link } from 'react-router-dom';
import { PenLine, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link to="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-stone-50 transition-transform group-hover:scale-105">
            <PenLine className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-stone-900">Margin</span>
        </Link>

        <nav className="flex items-center gap-1.5">
          {user ? (
            <>
              <Link
                to="/editor"
                className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200/60 hover:text-stone-900 sm:flex"
              >
                <PenLine className="h-4 w-4" />
                Write
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200/60 hover:text-stone-900"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-200 text-xs font-bold uppercase text-stone-700">
                  {user.email?.[0] ?? 'U'}
                </span>
                <span className="hidden max-w-[120px] truncate sm:inline">{user.email}</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200/60 hover:text-stone-900"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200/60 hover:text-stone-900"
              >
                <UserIcon className="h-4 w-4" />
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-stone-50 shadow-sm transition-all hover:bg-stone-800 hover:shadow-md"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

/*
# Create the shared blog platform data model

1. New Tables
- `posts` stores public blog articles with title, excerpt, body, category, cover color, author, publication status, and timestamps.
- `comments` stores reader replies attached to posts and linked to the authenticated author.

2. Security
- Row Level Security is enabled on both tables.
- Public visitors can read published posts and all comments.
- Authenticated users can create posts and comments.
- Post authors can update or delete only their own posts.
- Comment authors can update or delete only their own comments.

3. Important Notes
- Posts are intentionally shared content, so reading does not require an account.
- Author identity is taken from the signed-in account and cannot be changed through normal post or comment updates.
*/

CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 160),
  excerpt text NOT NULL DEFAULT '' CHECK (char_length(excerpt) <= 320),
  body text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Ideas' CHECK (char_length(category) BETWEEN 1 AND 40),
  cover_color text NOT NULL DEFAULT 'ocean',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts (created_at DESC);
CREATE INDEX IF NOT EXISTS comments_post_id_created_at_idx ON public.comments (post_id, created_at ASC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published posts" ON public.posts;
CREATE POLICY "Public can read published posts" ON public.posts
  FOR SELECT TO anon, authenticated USING (published = true OR auth.uid() = author_id);

DROP POLICY IF EXISTS "Signed in users can create posts" ON public.posts;
CREATE POLICY "Signed in users can create posts" ON public.posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update posts" ON public.posts;
CREATE POLICY "Authors can update posts" ON public.posts
  FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can delete posts" ON public.posts;
CREATE POLICY "Authors can delete posts" ON public.posts
  FOR DELETE TO authenticated USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Public can read comments" ON public.comments;
CREATE POLICY "Public can read comments" ON public.comments
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Signed in users can create comments" ON public.comments;
CREATE POLICY "Signed in users can create comments" ON public.comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update comments" ON public.comments;
CREATE POLICY "Authors can update comments" ON public.comments
  FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can delete comments" ON public.comments;
CREATE POLICY "Authors can delete comments" ON public.comments
  FOR DELETE TO authenticated USING (auth.uid() = author_id);
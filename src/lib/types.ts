export interface Post {
  id: string;
  author_id: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_color: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export type PostInput = {
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_color: string;
  published: boolean;
};

export interface Comment {
  id?: number;
  content: string;
  post_id: number;
  author: string;
  created_at?: number;
}
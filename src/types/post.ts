export interface Post {
  id?: number;
  title: string;
  content: string;
  category_id: number;
  created_at?: Date;
  category_name?: string;
}
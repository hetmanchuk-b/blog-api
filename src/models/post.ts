import pool from '../config/db';
import {Post} from "../types/post";

export const getAllPostsDB = async (category_id?: number): Promise<Post[]> => {
  const query = category_id
    ? 'SELECT posts.*, categories.name AS category_name FROM posts JOIN categories ON posts.category_id = categories.id WHERE category_id = $1'
    : 'SELECT posts.*, categories.name AS category_name FROM posts JOIN categories ON posts.category_id = categories.id';
  const params = category_id ? [category_id] : [];
  const result = await pool.query(query, params);
  return result.rows;
}

export const getPostByIdDB = async (id: number): Promise<Post | null> => {
  const result = await pool.query(
    'SELECT posts.*, categories.name AS category_name FROM posts JOIN categories ON posts.category_id = categories.id WHERE posts.id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export const createPostDB = async (post: Omit<Post, 'id' | 'created_at' | 'category_name'>): Promise<Post> => {
  const {title, content, category_id} = post;
  const result = await pool.query(
    'INSERT INTO posts (title, content, category_id) VALUES ($1, $2, $3) RETURNING *',
    [title, content, category_id]
  );
  return result.rows[0];
}

export const updatePostDB = async (
  id: number,
  post: Omit<Post, 'id' | 'created_at' | 'category_name'>
): Promise<Post | null> => {
  const {title, content, category_id} = post;
  const result = await pool.query(
    'UPDATE posts SET title = $1, content = $2, category_id = $3 WHERE id= $4 RETURNING *',
    [title, content, category_id, id]
  );
  return result.rows[0] || null;
}

export const deletePostDB = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    'DELETE FROM posts WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rowCount !== null && result.rowCount > 0
}
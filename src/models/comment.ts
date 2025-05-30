import pool from '../config/db';
import {Comment} from "../types/comment";

export const getCommentsByPostDB = async (post_id: number): Promise<Comment[]> => {
  const result = await pool.query(
    'SELECT * FROM comments WHERE post_id = $1',
    [post_id]
  );
  return result.rows;
}

export const createCommentDB = async (comment: Omit<Comment, 'id' | 'created_at'> & {user_id?: number}): Promise<Comment> => {
  const {content, post_id, author, user_id} = comment;
  const result = await pool.query(
    'INSERT INTO comments (content, post_id, author, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [content, post_id, author, user_id || null]
  );
  return result.rows[0];
}

export const deleteCommentDB = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    'DELETE FROM comments WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rowCount !== null && result.rowCount > 0;
}
import pool from '../config/db'
import {PasswordReset} from "../types/password-reset";

export const createResetTokenDB = async (user_id: number, token: string, expires_at: Date): Promise<PasswordReset> => {
  const result = await pool.query(
    'INSERT INTO password_resets (user_id, token, expires_at, used) VALUES ($1, $2, $3, $4) RETURNING *',
    [user_id, token, expires_at, false]
  );
  return result.rows[0];
}

export const findResetTokenDB = async (token: string): Promise<PasswordReset | null> => {
  const result = await pool.query('SELECT * FROM password_resets WHERE token = $1', [token]);
  return result.rows[0] || null;
}

export const deleteResetTokenDB = async (token: string): Promise<void> => {
  await pool.query('DELETE FROM password_resets WHERE token = $1', [token]);
}

export const markResetTokenAsUsedDB = async (token: string): Promise<void> => {
  await pool.query('UPDATE password_resets SET used = TRUE WHERE token = $1', [token]);
}
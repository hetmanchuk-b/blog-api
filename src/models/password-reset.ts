import pool from '../config/db'
import {PasswordReset} from "../types/password-reset";

export const createResetTokenDB = async (user_id: string, token: string, expires_at: Date): Promise<PasswordReset> => {
  const result = await pool.query(
    'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
    [user_id, token, expires_at]
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
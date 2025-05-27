import pool from '../config/db'
import {User} from "../types/user";
import bcrypt from 'bcrypt';

export const findUserByEmailDB = async (email: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export const findUserByUsernameDB = async (username: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0] || null;
}

export const findUserByIdDB = async (id: number): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export const createUserDB = async (user: Omit<User, 'id' | 'created_at' | 'login_attempts' | 'locked_until'>): Promise<User> => {
  const {username, email, password, role} = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, email, password, role]
  );
  return result.rows[0];
}

export const updateUserRoleDB = async (id: number, role: 'admin' | 'user'): Promise<User | null> => {
  const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING *', [role, id]);
  return result.rows[0] || null;
}

export const updateLoginAttemptsDB = async (id: number, attempts: number, locked_until?: Date): Promise<User | null> => {
  const result = await pool.query(
    'UPDATE users SET login_attempts = $1, locked_until = $2 WHERE id = $3 RETURNING *',
    [attempts, locked_until || null, id]
  );
  return result.rows[0] || null;
}

export const updatePasswordDB = async (id: number, password: string): Promise<User | null> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'UPDATE users SET password = $1, login_attempts = 0, locked_until = NULL WHERE id = $2 RETURNING *',
    [hashedPassword, id]
  );
  return result.rows[0] || null;
}

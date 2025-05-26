export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  created_at: Date;
  login_attempts?: number;
  locked_until?: Date | null;
}
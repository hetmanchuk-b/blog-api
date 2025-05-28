export interface PasswordReset {
  id?: number;
  user_id: number;
  token: string;
  used: boolean;
  expires_at: Date;
  created_at?: Date;
}
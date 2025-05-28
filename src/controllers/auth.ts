import {Request, Response} from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  createUserDB,
  findUserByEmailDB, findUserByIdDB,
  findUserByUsernameDB,
  updateLoginAttemptsDB,
  updatePasswordDB
} from "../models/user";
import {
  createResetTokenDB,
  deleteResetTokenDB,
  findResetTokenDB,
  markResetTokenAsUsedDB
} from "../models/password-reset";
import {sendEmail} from "../services/email-service";

const JWT_SECRET = process.env.JWT_SECRET!;
const MAX_LOGIN_ATTEMPTS = 20;
const LOCK_DURATION = 2 * 60 * 60 * 1000;

interface AuthRequest extends Request {
  user?: {id: number; username: string; email: string; role: 'admin' | 'user'};
}

export const register = async (req: Request, res: Response) => {
  const {username, email, password, role = 'user'} = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({error: 'Username, email and password are required'});
  }
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({error: 'Invalid role'});
  }

  try {
    const existingUser = await findUserByUsernameDB(username);
    if (existingUser) {
      return res.status(400).json({error: 'Username already exists'});
    }
    const user = await createUserDB({username, email, password, role});
    const token = jwt.sign({id: user.id, username, email, role}, JWT_SECRET, {expiresIn: '365d'});
    res.status(201).json({token, user: {id: user.id, username, email, role}});
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export const login = async (req: Request, res: Response) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({error: 'Username and password are required'});
  }

  try {
    const user = await findUserByUsernameDB(username);
    if (!user) {
      return res.status(401).json({error: 'Invalid credentials'});
    }

    if (user.locked_until && new Date(user.locked_until).getTime() > new Date().getTime()) {
      return res.status(429).json({error: 'Account is locked. Try again later'});
    }

    if (!(await bcrypt.compare(password, user.password!))) {
      const attempts = (user.login_attempts || 0) + 1;
      const locked_until = attempts >= MAX_LOGIN_ATTEMPTS ? new Date(Date.now() + LOCK_DURATION) : undefined;
      await updateLoginAttemptsDB(user.id!, attempts, locked_until);
      return res.status(401).json({error: 'Invalid credentials'});
    }

    await updateLoginAttemptsDB(user.id!, 0);
    const token = jwt.sign(
      {id: user.id, username, email: user.email, role: user.role},
      JWT_SECRET,
      {expiresIn: '365d'}
    );
    res.json({token, user: {id: user.id, username, email: user.email, role: user.role}});
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  const {email} = req.body;
  if (!email || !email.length) {
    res.status(400).json({error: 'Email is required'});
  }

  try {
    const user = await findUserByEmailDB(email);
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await createResetTokenDB(user.id!, token, expires_at);

    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
    const emailContent = `
      <h1>Password Reset</h1>
      <p>You requested password reset for account ${user.username}</p>
      <p>Follow the link to set a new password</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Link is available for 24 hours.</p>
      <p>If you did not request a reset, please ignore this email.</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset for Blog Website',
      html: emailContent
    });

    res.json({message: 'Password reset token generated'});
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const {token, newPassword} = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({error: 'Token and new password are required'});
  }

  try {
    const reset = await findResetTokenDB(token);
    if (!reset || new Date(reset.expires_at).getTime() < new Date().getTime()) {
      return res.status(400).json({error: 'Invalid or expired token'});
    }
    if (reset.used) {
      await deleteResetTokenDB(token);
      return res.status(400).json({error: 'Token has already been used'});
    }

    const user = await findUserByIdDB(reset.user_id);
    if (!user) {
      await deleteResetTokenDB(token);
      return res.status(400).json({error: 'User not found'});
    }

    await updatePasswordDB(reset.user_id, newPassword);
    await markResetTokenAsUsedDB(token);
    await deleteResetTokenDB(token);

    const newToken = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      {expiresIn: '365d'}
    );
    res.status(200).json({ token: newToken });
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export const verifyToken = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({error: 'Unauthorized'});
    }
    res.status(200).json({token: req.user});
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export const verifyResetToken = async (req: Request, res: Response) => {
  const {token} = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({error: 'Token is required'});
  }

  try {
    const resetToken = await findResetTokenDB(token);
    if (!resetToken) {
      return res.status(404).json({error: 'Invalid or expired token'});
    }

    if (resetToken.used) {
      await deleteResetTokenDB(token);
      return res.status(400).json({error: 'Token has already been used'});
    }

    if (new Date(resetToken.expires_at).getTime() < new Date().getTime()) {
      await deleteResetTokenDB(token);
      return res.status(400).json({error: 'Token has expired'});
    }

    res.status(200).json({message: 'Token is valid'});
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}




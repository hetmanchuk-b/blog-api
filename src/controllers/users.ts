import {Request, Response} from 'express'
import {
  findUserByEmailDB,
  findUserByIdDB,
  findUserByUsernameDB,
  getAllUsersDB,
  updateUserDB,
  updateUserRoleDB
} from "../models/user";
import {validateBio, validateEmail, validateUsername} from "../validators/users";
import {User} from "../types/user";

export const changeUserRole = async (req: Request<{id: string, role: 'admin' | 'user'}>, res: Response) => {
  const {id} = req.params;
  const {role} = req.body;
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({error: 'Invalid role'});
  }

  try {
    const user = await updateUserRoleDB(Number(id), role);
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }
    res.json({id: user.id, username: user.username, email: user.email, role: user.role});
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersDB();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const user = await findUserByIdDB(id);
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }
    res.json({id: user.id, username: user.username, email: user.email, role: user.role, bio: user.bio});
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

interface AuthRequest extends Request {
  user?: {id: number; username: string; email: string; role: 'admin' | 'user', bio: string | null};
}

export const getUserSelf = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({error: 'Unauthorized'});
    }
    const user = await findUserByIdDB(Number(req.user.id));
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export const updateUser = async (req: AuthRequest, res: Response) => {
  const {username, email, bio} = req.body;

  if (!req.user) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  const usernameError = username ? validateUsername(username) : null;
  const emailError = email ? validateEmail(email) : null;
  const bioError = bio !== undefined ? validateBio(bio) : null;

  if (usernameError || emailError || bioError) {
    return res.status(400).json({
      errors: {
        username: usernameError,
        email: emailError,
        bio: bioError
      }
    });
  }

  try {
    if (username && username !== req.user.username) {
      const existingUser = await findUserByUsernameDB(username);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(409).json({error: 'Username is already taken'});
      }
    }

    if (email && email !== req.user.email) {
      const existingUser = await findUserByEmailDB(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(409).json({error: 'Email is already taken'});
      }
    }

    const updates: Partial<User> = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (bio !== undefined) updates.bio = bio;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({error: 'No fields to update'});
    }

    const updatedUser = await updateUserDB(req.user.id, updates);
    res.status(200).json(updatedUser);
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}
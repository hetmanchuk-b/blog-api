import {Request, Response, NextFunction} from 'express'
import {findUserByUsernameDB, updateLoginAttemptsDB} from "../models/user";

export const loginRateLimit = async (req: Request, res: Response, next: NextFunction) => {
  const {username} = req.body;
  if (!username) {
    return res.status(400).json({error: 'Username is required'});
  }

  try {
    const user = await findUserByUsernameDB(username);
    if (user && user.locked_until && new Date(user.locked_until).getTime() > new Date().getTime()) {
      return res.status(429).json({ error: 'Account is locked. Try again later' });
    }
    next();
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}
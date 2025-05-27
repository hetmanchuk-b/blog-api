import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import {User} from "../types/user";

interface AuthRequest extends Request {
  user?: User;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return res.status(401).json({error: 'No token provided'});
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({error: 'Invalid token'})
  }
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({error: 'Admin access required'});
  }
  next();
}

export const isAuthenticatedOrGuest = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as User;
      req.user = decoded;
    } catch (err: any) {
      // TODO: continue as guest
    }
  }
  next();
}






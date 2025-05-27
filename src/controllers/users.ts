import {Request, Response} from 'express'
import {findUserByIdDB, updateUserRoleDB} from "../models/user";

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

export const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const user = await findUserByIdDB(id);
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }
    res.json({id: user.id, username: user.username, email: user.email, role: user.role});
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}
import express, { Router } from 'express';
import { changeUserRole, getUser } from '../controllers/users';
import { authenticate, isAdmin } from '../middleware/auth';

const router: Router = express.Router();

// @ts-ignore
router.put('/:id/role', authenticate, isAdmin, changeUserRole);
// @ts-ignore
router.get('/:id', authenticate, isAdmin, getUser);

export default router;
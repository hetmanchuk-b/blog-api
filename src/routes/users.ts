import express, { Router } from 'express';
import {changeUserRole, getAllUsers, getUser, getUserSelf, updateUser} from '../controllers/users';
import { authenticate, isAdmin } from '../middleware/auth';

const router: Router = express.Router();

// @ts-ignore
router.get('/', authenticate, isAdmin, getAllUsers);
// @ts-ignore
router.get('/:id', authenticate, isAdmin, getUser);
// @ts-ignore
router.get('/me', authenticate, getUserSelf)
// @ts-ignore
router.put('/:id/role', authenticate, isAdmin, changeUserRole);
// @ts-ignore
router.put('/me', authenticate, updateUser)


export default router;
import express, {Router} from 'express'
import {register, login, forgotPassword, resetPassword, verifyToken, verifyResetToken} from "../controllers/auth";
import {loginRateLimit} from "../middleware/rate-limit";
import {authenticate} from "../middleware/auth";

const router: Router = express.Router();

// @ts-ignore
router.post('/register', register);
// @ts-ignore
router.post('/login', loginRateLimit, login);
// @ts-ignore
router.post('/forgot-password', forgotPassword);
// @ts-ignore
router.post('/reset-password', resetPassword);
// @ts-ignore
router.get('/verify', authenticate, verifyToken);
// @ts-ignore
router.get('/verify-reset-token', verifyResetToken);

export default router;
import express, {Router} from 'express'
import {register, login, forgotPassword, resetPassword} from "../controllers/auth";
import {loginRateLimit} from "../middleware/rate-limit";

const router: Router = express.Router();

// @ts-ignore
router.post('/register', register);
// @ts-ignore
router.post('/login', loginRateLimit, login);
// @ts-ignore
router.post('/forgot-password', forgotPassword);
// @ts-ignore
router.post('/reset-password', resetPassword);

export default router;
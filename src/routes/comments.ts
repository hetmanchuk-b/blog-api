import express, {Router} from "express";
import {getCommentsByPost, createComment, deleteComment} from "../controllers/comments";
import {authenticate, isAdmin, isAuthenticatedOrGuest} from "../middleware/auth";

const router: Router = express.Router();

router.get('/:post_id', getCommentsByPost);
router.post('/', isAuthenticatedOrGuest, createComment);
// @ts-ignore
router.delete('/:id', authenticate, isAdmin, deleteComment);

export default router;
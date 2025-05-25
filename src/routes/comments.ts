import express, {Router} from "express";
import {getCommentsByPost, createComment, deleteComment} from "../controllers/comments";

const router: Router = express.Router();

router.get('/:post_id', getCommentsByPost);
router.post('/', createComment);
// @ts-ignore
router.delete('/:id', deleteComment);

export default router;
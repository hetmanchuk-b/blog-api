import express, {Router} from 'express';
import {getPosts, getPostById, createPost, deletePost, updatePost} from "../controllers/posts";
import {authenticate, isAdmin} from "../middleware/auth";

const router: Router = express.Router();

router.get('/', getPosts);
// @ts-ignore
router.get('/:id', getPostById);
// @ts-ignore
router.post('/', authenticate, isAdmin, createPost);
// @ts-ignore
router.put('/:id', authenticate, isAdmin, updatePost);
// @ts-ignore
router.delete('/:id', authenticate, isAdmin, deletePost);

export default router;

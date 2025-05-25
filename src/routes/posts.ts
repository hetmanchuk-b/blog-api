import express, {Router} from 'express';
import {getPosts, getPostById, createPost, deletePost, updatePost} from "../controllers/posts";

const router: Router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
// @ts-ignore
router.post('/', createPost);
// @ts-ignore
router.put('/:id', updatePost);
// @ts-ignore
router.delete('/:id', deletePost);

export default router;

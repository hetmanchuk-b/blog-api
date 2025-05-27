import {Request, Response} from 'express';
import {Comment} from "../types/comment";
import {getCommentsByPostDB, createCommentDB, deleteCommentDB} from "../models/comment";
import {getPostByIdDB} from "../models/post";

interface AuthRequest extends Request {
  user?: {id: number; username: string; email: string; role: 'admin' | 'user'};
}

export const getCommentsByPost = async (req: Request, res: Response<Comment[] | Record<string, any>>) => {
  try {
    const post_id = Number(req.params.post_id);
    if (!post_id) {
      res.status(400).json({error: 'Post ID is required'});
    }
    const comments = await getCommentsByPostDB(post_id);
    res.json(comments);
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export const createComment = async (req: AuthRequest, res: Response<Comment | Record<string, any>>) => {
  const {content, post_id} = req.body;
  if (!content) {
    res.status(400).json({ error: 'Missing content' });
  }
  if (!post_id) {
    res.status(400).json({ error: 'Missing post ID' });
  }

  const post = await getPostByIdDB(Number(post_id));
  if (!post) {
    res.status(404).json({ error: 'Missing post' });
  }

  try {
    const commentData: any = {
      content,
      post_id,
      author: req.user ? req.user.username : 'Guest',
    }
    if (req.user) {
      commentData.user_id = req.user.id;
    }
    const comment = await createCommentDB(commentData);
    res.status(201).json(comment);
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export const deleteComment = async (req: Request<{id: string}>, res: Response<Comment | Record<string, any>>) => {
  try {
    const id = Number(req.params.id);
    const success = await deleteCommentDB(id);
    if (!success) {
      return res.status(404).json({error: 'Comment not found'});
    }
    res.json({message: 'Comment deleted successfully'});
  } catch (err: any) {
    res.status(500).json({error: err.message});
  }
}
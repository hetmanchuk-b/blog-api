import {Request, Response} from 'express';
import {Post} from "../types/post";
import {getAllPostsDB, getPostByIdDB, createPostDB, deletePostDB, updatePostDB} from "../models/post";
import {getCategoryByIdDB} from "../models/category";

export const getPosts = async (req: Request, res: Response<Post[] | Record<string, any>>) => {
  try {
    const category_id = req.query.category_id ? Number(req.query.category_id) : undefined;
    const posts = await getAllPostsDB(category_id);
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({error: err.message})
  }
}

export const getPostById = async (req: Request<{id: string}>, res: Response<Post | null | Record<string, any>>) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({error: 'Invalid Post ID'});
    }
    const post = await getPostByIdDB(id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export const createPost = async (req: Request, res: Response<Post | Record<string, any>>) => {
  const {title, content, category_id} = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Missing title' });
  }
  if (!content) {
    return res.status(400).json({ error: 'Missing content' });
  }
  if (!category_id) {
    return res.status(400).json({ error: 'Missing post category ID' });
  }

  const category = await getCategoryByIdDB(Number(category_id));
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
  }

  try {
    const post = await createPostDB({title, content, category_id});
    res.status(201).json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export const updatePost = async (
  req: Request<{id: string}>,
  res: Response<Post | null | Record<string, any>>
) => {
  const {title, content, category_id} = req.body;
  const id = Number(req.params.id);
  if (!title) {
    return res.status(400).json({error: 'Missing title'});
  }
  if (!content) {
    return res.status(400).json({error: 'Missing content'});
  }
  if (!category_id) {
    return res.status(400).json({error: 'Missing category ID'})
  }

  try {
    const post = await updatePostDB(id, {title, content, category_id});
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export const deletePost = async (req: Request<{id: string}>, res: Response<Post | Record<string, any>>) => {
  const id = Number(req.params.id);
  try {
    const success = await deletePostDB(id);
    if (!success) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({message: 'Post deleted successfully'});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
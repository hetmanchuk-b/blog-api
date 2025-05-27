import express, { Router } from "express";
import {getCategories, createCategory, deleteCategory, getCategoryById} from "../controllers/categories";
import {authenticate, isAdmin} from "../middleware/auth";

const router: Router = express.Router();

router.get("/", getCategories);
router.get('/:id', getCategoryById);
// @ts-ignore
router.post('/', authenticate, isAdmin, createCategory);
// @ts-ignore
router.delete('/:id', authenticate, isAdmin, deleteCategory)

export default router;
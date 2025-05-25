import express, { Router } from "express";
import {getCategories, createCategory, deleteCategory, getCategoryById} from "../controllers/categories";

const router: Router = express.Router();

router.get("/", getCategories);
router.get('/:id', getCategoryById);
// @ts-ignore
router.post('/', createCategory);
// @ts-ignore
router.delete('/:id', deleteCategory)

export default router;
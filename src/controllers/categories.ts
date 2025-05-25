import {Request, Response} from 'express';
import {Category} from "../types/category";
import {getAllCategoriesDB, createCategoryDB, deleteCategoryDB, getCategoryByIdDB} from "../models/category";

export const getCategories = async (req: Request, res: Response<Category[] | Record<string, any>>) => {
  try {
    const categories = await getAllCategoriesDB();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export const getCategoryById = async (req: Request, res: Response<Category | Record<string, any>>) => {
  const {id} = req.params;
  try {
    const category = await getCategoryByIdDB(Number(id));
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export const createCategory = async (req: Request<{}, {}, Category>, res: Response<Category | Record<string, any>>) => {
  const {name} = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Missing name' });
  }
  try {
    const category = await createCategoryDB(name);
    res.status(201).json(category);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export const deleteCategory  = async (req: Request<{id: string}>, res: Response) => {
  const {id} = req.params;
  try {
    const success = await deleteCategoryDB(Number(id));
    if (!success) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({message: 'Category deleted successfully'});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
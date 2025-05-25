import pool from "../config/db";
import {Category} from "../types/category";

export const getAllCategoriesDB = async (): Promise<Category[]> => {
  const result = await pool.query("SELECT * FROM categories");
  return result.rows;
}

export const getCategoryByIdDB = async (id: number): Promise<Category> => {
  const result = await pool.query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export const createCategoryDB = async (name: string): Promise<Category> => {
  const result = await pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
}

export const deleteCategoryDB = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    'DELETE FROM categories WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rowCount !== null && result.rowCount > 0
}
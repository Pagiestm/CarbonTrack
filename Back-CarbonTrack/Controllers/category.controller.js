// category.controller.js
import { CategoryService } from '../Services/category.services.js';

const categoryService = new CategoryService();

class CategoryController {
    getAllCategories() {
        return async (req, res) => {
            try {
                const categories = await categoryService.getAllCategories();
                res.status(200).json(categories);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }

    getCategoriesWithMaterials() {
        return async (req, res) => {
            try {
                const categoriesWithMaterials = await categoryService.getCategoriesWithMaterials();
                res.status(200).json(categoriesWithMaterials);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }

    createCategory() {
        return async (req, res) => {
            const { name } = req.body;

            try {
                const newCategory = await categoryService.createCategory(name);
                res.status(201).json(newCategory);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }

    updateCategory() {
        return async (req, res) => {
            const { id } = req.params;
            const { name } = req.body;

            try {
                const updatedCategory = await categoryService.updateCategory(parseInt(id), name);
                if (!updatedCategory) {
                    return res.status(404).json({ error: 'Category not found' });
                }
                res.status(200).json(updatedCategory);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }
}

export const categoryController = new CategoryController();

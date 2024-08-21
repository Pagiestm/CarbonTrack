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
            try {
                const newCategory = await categoryService.createCategory(req.body);
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
    
    deleteCategory() {
        return async (req, res) => {
            const { id } = req.params;

            try {
                const deletedCategory = await categoryService.deleteCategory(parseInt(id));
                if (!deletedCategory) {
                    return res.status(404).json({ error: 'Category not found' });
                }
                res.status(200).json({ message: 'Category deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }
}

export const categoryController = new CategoryController();

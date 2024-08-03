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
}

export const categoryController = new CategoryController();
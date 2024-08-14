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

    syncCategoryWebhook() {
        return async (req, res) => {
            const { event, entry, model } = req.body;

            console.log('Webhook received:', req.body);

            try {
                if (model === 'category') {
                    await categoryService.syncCategory(event, entry);
                }

                res.status(200).json({ message: 'Synchronized successfully' });
            } catch (error) {
                console.error('Error synchronizing:', error);
                res.status(500).json({ error: error.message });
            }
        };
    }
}

export const categoryController = new CategoryController();

// category.service.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryService {
    async getAllCategories() {
        try {
            return await prisma.category.findMany();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getCategoryById(id) {
        try {
            return await prisma.category.findUnique({
                where: { id: id }
            });
        } catch (error) {
            throw new Error('Error fetching category by ID: ' + error.message);
        }
    }

    async getCategoriesWithMaterials() {
        try {
            return await prisma.category.findMany({
                where: {
                    Materials: {
                        some: {},
                    },
                },
                include: {
                    Materials: true,
                },
            });
        } catch (error) {
            throw new Error('Error fetching categories with materials: ' + error.message);
        }
    }

    async createCategory(data) {
        try {
            return await prisma.category.create({
                data
            });
        } catch (error) {
            throw new Error('Error creating category: ' + error.message);
        }
    }

    async updateCategory(id, data) {
        try {
            const category = await prisma.category.update({
                where: { id: parseInt(id, 10) },
                data,
            });
            return category;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteCategory(id) {
        try {
            const category = await prisma.category.findUnique({
                where: { id: id }
            });

            if (!category) {
                return null;
            }

            await prisma.category.delete({
                where: { id: id }
            });

            return category;
        } catch (error) {
            throw new Error('Error deleting category: ' + error.message);
        }
    }
}

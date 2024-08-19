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

    async createCategory(name) {
        try {
            const newCategory = await prisma.category.create({
                data: {
                    name: name
                }
            });
            return newCategory;
        } catch (error) {
            throw new Error('Error creating category: ' + error.message);
        }
    }

    async updateCategory(id, name) {
        try {
            const category = await prisma.category.findUnique({
                where: { id: id }
            });

            if (!category) {
                return null;
            }

            const updatedCategory = await prisma.category.update({
                where: { id: id },
                data: { name: name }
            });
            return updatedCategory;
        } catch (error) {
            throw new Error('Error updating category: ' + error.message);
        }
    }
}

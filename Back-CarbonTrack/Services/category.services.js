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
}
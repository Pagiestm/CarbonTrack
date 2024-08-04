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

    async syncCategory(event, entry) {
        try {
            if (event === 'entry.create' || event === 'entry.update') {
                console.log('Upserting category:', entry);
                await prisma.category.upsert({
                    where: { id: entry.id },
                    update: {
                        name: entry.name
                    },
                    create: {
                        id: entry.id,
                        name: entry.name
                    }
                });
            } else if (event === 'entry.delete') {
                console.log('Deleting category:', entry.id);
                await prisma.category.delete({
                    where: { id: entry.id }
                });
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
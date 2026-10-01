// material.service.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MaterialService {

    async getAllMaterials() {
        try {
            return await prisma.material.findMany();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMaterialById(id) {
        try {
            const material = await prisma.material.findUnique({ where: { id: parseInt(id, 10) } });
            if (!material) {
                throw new Error('Material not found');
            }
            return material;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createMaterial(data) {
        try {
            return await prisma.material.create({ data });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateMaterial(id, data) {
        try {
            const material = await prisma.material.update({
                where: { id: parseInt(id, 10) },
                data,
            });
            return material;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteMaterial(id) {
        try {
            await prisma.material.delete({ where: { id: parseInt(id, 10) } });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
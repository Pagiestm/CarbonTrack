// profile.service.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProfileService {

    async getProfile(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: parseInt(userId, 10) },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    googleId: true,
                },
            });
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllUsers() {
        try {
            const users = await prisma.user.findMany();
            return users;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProfile(userId, profileData) {
        try {
            const { name, email } = profileData;
            const updateData = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;

            const user = await prisma.user.update({
                where: { id: parseInt(userId, 10) },
                data: updateData,
            });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteUserAndProjects(userId) {
        return prisma.$transaction(async (prisma) => {
            // Supprimer les ProjectMaterial associés aux projets de l'utilisateur
            await prisma.projectMaterial.deleteMany({
                where: {
                    project: {
                        userId: userId
                    }
                }
            });

            // Supprimer les projets de l'utilisateur
            await prisma.project.deleteMany({
                where: { userId }
            });

            // Supprimer l'utilisateur
            await prisma.user.delete({
                where: { id: userId }
            });
        });
    }
}
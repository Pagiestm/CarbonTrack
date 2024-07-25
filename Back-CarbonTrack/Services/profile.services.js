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
                    createdAt: true,
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

    async updateProfile(userId, profileData) {
        try {
            const user = await prisma.user.update({
                where: { id: parseInt(userId, 10) },
                data: profileData,
            });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
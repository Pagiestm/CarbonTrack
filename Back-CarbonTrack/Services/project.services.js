import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectService {

    async getAllProjects() {
        try {
            return await prisma.project.findMany();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProjectById(id) {
        try {
            const project = await prisma.project.findUnique({ where: { id: parseInt(id, 10) } });
            if (!project) {
                throw new Error('Project not found');
            }
            return project;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createProject(data) {
        try {
            const { name, description, userId, materials } = data;
    
            // Récupére les détails des matériaux depuis la base de données
            const materialDetails = await prisma.material.findMany({
                where: {
                    id: {
                        in: materials.map(material => material.materialId)
                    }
                }
            });
    
            // Calcule l'empreinte carbone totale
            const totalFootprint = materials.reduce((sum, material) => {
                const materialDetail = materialDetails.find(md => md.id === material.materialId);
                return sum + (materialDetail.carbonFootprint * material.quantity);
            }, 0);
    
            return await prisma.project.create({
                data: {
                    name,
                    description,
                    totalFootprint,
                    user: {
                        connect: { id: userId }
                    },
                    ProjectMaterial: {
                        create: materials.map(material => ({
                            materialId: material.materialId,
                            quantity: material.quantity,
                        })),
                    },
                },
                include: {
                    ProjectMaterial: true,
                },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProject(id, data) {
        try {
            const { materials, ...projectData } = data;
            const projectId = parseInt(id, 10);
    
            // Récupére les matériaux actuels associés au projet
            const currentMaterials = await prisma.projectMaterial.findMany({
                where: { projectId: projectId },
            });
    
            // Identifie les matériaux à supprimer
            const materialsToDelete = currentMaterials.filter(
                currentMaterial => !materials.some(material => material.materialId === currentMaterial.materialId)
            );
    
            // Supprime les matériaux qui ne sont plus présents
            await prisma.projectMaterial.deleteMany({
                where: {
                    projectId: projectId,
                    materialId: { in: materialsToDelete.map(material => material.materialId) },
                },
            });
    
            // Met à jour ou créer les matériaux existants
            const upsertPromises = materials.map(material =>
                prisma.projectMaterial.upsert({
                    where: { projectId_materialId: { projectId: projectId, materialId: material.materialId } },
                    update: { quantity: material.quantity },
                    create: { projectId: projectId, materialId: material.materialId, quantity: material.quantity },
                })
            );
            await Promise.all(upsertPromises);
    
            // Récupére les détails des matériaux mis à jour
            const updatedMaterials = await prisma.projectMaterial.findMany({
                where: { projectId: projectId },
                include: { material: true },
            });
    
            // Calculer la nouvelle empreinte carbone totale
            const totalFootprint = updatedMaterials.reduce((sum, projectMaterial) => {
                return sum + (projectMaterial.material.carbonFootprint * projectMaterial.quantity);
            }, 0);
    
            // Met à jour le projet avec la nouvelle empreinte carbone totale
            const updatedProject = await prisma.project.update({
                where: { id: projectId },
                data: { 
                    ...projectData,
                    totalFootprint: totalFootprint 
                },
            });
    
            return updatedProject;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du projet:', error);
            throw error;
        }
    }

    async deleteProject(id) {
        try {
            const projectId = parseInt(id, 10);
    
            // Supprime les matériaux associés
            await prisma.projectMaterial.deleteMany({
                where: { projectId: projectId },
            });
    
            // Supprime le projet
            await prisma.project.delete({
                where: { id: projectId },
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
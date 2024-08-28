import { ProjectService } from '../Services/project.services.js';

const projectService = new ProjectService();

class ProjectController {
    getAllProjects() {
        return async (req, res) => {
            const userId = parseInt(req.userId, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            try {
                const projects = await projectService.getAllProjects(userId);
                res.json(projects);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }

    getProjectById() {
        return async (req, res) => {
            const userId = parseInt(req.userId, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            try {
                const project = await projectService.getProjectById(req.params.id, userId);
                if (!project) {
                    return res.status(404).json({ error: 'Project not found' });
                }
                res.json(project);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }

    getAllProjectsForAdmin() {
        return async (req, res) => {
            const userId = parseInt(req.userId, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            try {
                const projects = await projectService.getAllProjectsForAdmin(userId);
                res.json(projects);
            } catch (error) {
                res.status(403).json({ error: error.message });
            }
        };
    }

    createProject() {
        return async (req, res) => {
            const userId = parseInt(req.userId, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            try {
                const project = await projectService.createProject(req.body, userId);
                res.status(201).json(project);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }

    updateProject() {
        return async (req, res) => {
            const userId = parseInt(req.userId, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            try {
                const project = await projectService.updateProject(req.params.id, req.body, userId);
                if (!project) {
                    return res.status(404).json({ error: 'Project not found' });
                }
                res.json(project);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }

    deleteProject() {
        return async (req, res) => {
            const userId = parseInt(req.userId, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            try {
                await projectService.deleteProject(req.params.id, userId);
                res.status(204).send();
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }
}

export default new ProjectController();
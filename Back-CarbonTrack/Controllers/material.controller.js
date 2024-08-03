// material.controller.js
import { MaterialService } from '../Services/material.services.js';

const materialService = new MaterialService();

class MaterialController {
    
    getAllMaterials() {
        return async (req, res) => {
            try {
                const materials = await materialService.getAllMaterials();
                res.json(materials);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }

    getMaterialById() {
        return async (req, res) => {
            try {
                const material = await materialService.getMaterialById(req.params.id);
                if (material) {
                    res.json(material);
                } else {
                    res.status(404).json({ error: 'Material not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }

    createMaterial() {
        return async (req, res) => {
            try {
                const material = await materialService.createMaterial(req.body);
                res.status(201).json(material);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }

    updateMaterial() {
        return async (req, res) => {
            try {
                const material = await materialService.updateMaterial(req.params.id, req.body);
                res.json(material);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }

    deleteMaterial() {
        return async (req, res) => {
            try {
                await materialService.deleteMaterial(req.params.id);
                res.status(204).send();
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }
}

export const materialController = new MaterialController();
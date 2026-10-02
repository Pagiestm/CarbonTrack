import * as categoryService from './category.service.js';
import * as materialService from './material.service.js';

export const categoryController = {
  async list(req, res) {
    res.json(await categoryService.listCategories());
  },

  async listWithMaterials(req, res) {
    res.json(await categoryService.listCategoriesWithMaterials());
  },

  async create(req, res) {
    res.status(201).json(await categoryService.createCategory(req.valid.body));
  },

  async update(req, res) {
    res.json(await categoryService.updateCategory(req.valid.params.id, req.valid.body));
  },

  async remove(req, res) {
    await categoryService.deleteCategory(req.valid.params.id);
    res.json({ message: 'Catégorie supprimée' });
  },
};

export const materialController = {
  async list(req, res) {
    res.json(await materialService.listMaterials(req.valid.query));
  },

  async get(req, res) {
    res.json(await materialService.getMaterial(req.valid.params.id));
  },

  async create(req, res) {
    res.status(201).json(await materialService.createMaterial(req.valid.body));
  },

  async update(req, res) {
    res.json(await materialService.updateMaterial(req.valid.params.id, req.valid.body));
  },

  async remove(req, res) {
    await materialService.deleteMaterial(req.valid.params.id);
    res.status(204).end();
  },
};

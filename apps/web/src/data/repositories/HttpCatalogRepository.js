import { CatalogRepository } from '@/domain/repositories/index.js';
import { toCategory, toMaterial } from '@/data/models/index.js';

export class HttpCatalogRepository extends CatalogRepository {
  constructor({ http }) {
    super();
    this.http = http;
  }

  async listCategories() {
    const { data } = await this.http.get('/categories');
    return (data.categories ?? data).map(toCategory);
  }

  async listCategoriesWithMaterials() {
    const { data } = await this.http.get('/categories/categories-with-materials');
    return (data.categories ?? data).map(toCategory);
  }

  async createCategory(name) {
    const { data } = await this.http.post('/categories', { name });
    return toCategory(data.category ?? data);
  }

  async updateCategory(id, name) {
    const { data } = await this.http.put(`/categories/${id}`, { name });
    return toCategory(data.category ?? data);
  }

  async deleteCategory(id) {
    await this.http.delete(`/categories/${id}`);
  }

  async listMaterials() {
    const { data } = await this.http.get('/materials');
    return (data.materials ?? data).map(toMaterial);
  }

  async material(id) {
    const { data } = await this.http.get(`/materials/${id}`);
    return toMaterial(data.material ?? data);
  }

  async createMaterial(materiau) {
    const { data } = await this.http.post('/materials', materiau);
    return toMaterial(data.material ?? data);
  }

  async updateMaterial(id, materiau) {
    const { data } = await this.http.put(`/materials/${id}`, materiau);
    return toMaterial(data.material ?? data);
  }

  async deleteMaterial(id) {
    await this.http.delete(`/materials/${id}`);
  }
}

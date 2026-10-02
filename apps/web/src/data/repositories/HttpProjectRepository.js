import { ProjectRepository } from '@/domain/repositories/index.js';
import { toPage, toProject } from '@/data/models/index.js';

export class HttpProjectRepository extends ProjectRepository {
  constructor({ http }) {
    super();
    this.http = http;
  }

  async list(options = {}) {
    const { data } = await this.http.get('/projects', { params: options });
    return toPage(data, toProject);
  }

  async listAll(options = {}) {
    const { data } = await this.http.get('/projects/admin/projects', { params: options });
    return toPage(data, toProject);
  }

  async get(id) {
    const { data } = await this.http.get(`/projects/${id}`);
    return toProject(data.project ?? data);
  }

  async create(projet) {
    const { data } = await this.http.post('/projects', projet);
    return toProject(data.project ?? data);
  }

  async update(id, projet) {
    const { data } = await this.http.put(`/projects/${id}`, projet);
    return toProject(data.project ?? data);
  }

  async remove(id) {
    await this.http.delete(`/projects/${id}`);
  }
}

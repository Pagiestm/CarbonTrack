import { ContactRepository } from '@/domain/repositories/index.js';

export class HttpContactRepository extends ContactRepository {
  constructor({ http }) {
    super();
    this.http = http;
  }

  async send(message) {
    const { data } = await this.http.post('/contact', message);
    return data.message;
  }
}

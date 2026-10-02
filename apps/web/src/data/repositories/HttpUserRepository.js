import { UserRepository } from '@/domain/repositories/index.js';
import { toUser } from '@/data/models/index.js';

export class HttpUserRepository extends UserRepository {
  constructor({ http }) {
    super();
    this.http = http;
  }

  async profile() {
    const { data } = await this.http.get('/profile');
    return toUser(data.user ?? data);
  }

  async updateProfile(champs) {
    const { data } = await this.http.put('/profile', champs);
    return toUser(data.user ?? data);
  }

  async deleteAccount() {
    await this.http.delete('/profile');
  }

  async listAll() {
    const { data } = await this.http.get('/profile/admin/users');
    return (data.users ?? data).map(toUser);
  }
}

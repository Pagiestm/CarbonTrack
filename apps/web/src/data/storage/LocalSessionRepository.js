import { SessionRepository } from '@/domain/repositories/index.js';
import { toSession } from '@/data/models/index.js';

const CLE = 'authToken';

export class LocalSessionRepository extends SessionRepository {
  read() {
    const token = localStorage.getItem(CLE);
    if (!token) return null;
    try {
      return toSession(token);
    } catch {
      this.clear();
      return null;
    }
  }

  save(token) {
    localStorage.setItem(CLE, token);
    return this.read();
  }

  clear() {
    localStorage.removeItem(CLE);
    localStorage.removeItem('role');
  }

  consumeFromUrl() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const token = fragment.get('token');
    if (!token) return null;

    const session = this.save(token);
    window.history.replaceState({}, document.title, window.location.pathname);
    return session;
  }
}

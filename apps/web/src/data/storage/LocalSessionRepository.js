import { SessionRepository } from '@/domain/repositories/index.js';
import { toSession } from '@/data/models/index.js';

const CLE = 'authToken';

/**
 * Session rangée dans le localStorage. Détail technique : le domaine ne sait
 * pas où elle est stockée, il demande juste une session au dépôt.
 */
export class LocalSessionRepository extends SessionRepository {
  read() {
    const token = localStorage.getItem(CLE);
    if (!token) return null;
    try {
      return toSession(token);
    } catch {
      // Jeton illisible (format changé, valeur tronquée) : on repart propre.
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
    localStorage.removeItem('role'); // clé des anciennes versions du client
  }

  /**
   * Retour de Google : le jeton arrive dans le fragment (#token=…), qui n'est
   * jamais transmis au serveur. On le consomme et on nettoie l'URL.
   */
  consumeFromUrl() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const token = fragment.get('token');
    if (!token) return null;

    const session = this.save(token);
    window.history.replaceState({}, document.title, window.location.pathname);
    return session;
  }
}

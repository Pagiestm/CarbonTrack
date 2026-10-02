import { createHttpClient } from '@/data/http/httpClient.js';
import { LocalSessionRepository } from '@/data/storage/LocalSessionRepository.js';
import { HttpAuthRepository } from '@/data/repositories/HttpAuthRepository.js';
import { HttpCatalogRepository } from '@/data/repositories/HttpCatalogRepository.js';
import { HttpContactRepository } from '@/data/repositories/HttpContactRepository.js';
import { HttpProjectRepository } from '@/data/repositories/HttpProjectRepository.js';
import { HttpUserRepository } from '@/data/repositories/HttpUserRepository.js';

import * as auth from '@/domain/use-cases/auth/index.js';
import * as catalog from '@/domain/use-cases/catalog/index.js';
import * as contact from '@/domain/use-cases/contact/index.js';
import * as projects from '@/domain/use-cases/projects/index.js';
import * as users from '@/domain/use-cases/users/index.js';

/**
 * Racine de composition : le seul endroit où l'on choisit quelle
 * implémentation sert quel contrat.
 *
 * C'est ce qui permet au domaine d'ignorer axios et le localStorage. Pour un
 * test, on rappelle `createContainer` avec de faux dépôts et rien d'autre ne
 * change.
 */
export const createContainer = ({ apiBaseUrl = import.meta.env.VITE_API_BASE_URL } = {}) => {
  const sessionRepository = new LocalSessionRepository();

  const http = createHttpClient({
    baseURL: apiBaseUrl,
    getToken: () => sessionRepository.read()?.token ?? null,
  });

  const depots = {
    sessionRepository,
    authRepository: new HttpAuthRepository({ http, apiBaseUrl }),
    userRepository: new HttpUserRepository({ http }),
    catalogRepository: new HttpCatalogRepository({ http }),
    projectRepository: new HttpProjectRepository({ http }),
    contactRepository: new HttpContactRepository({ http }),
  };

  // Chaque cas d'usage reçoit tous les dépôts ; il ne retient que ceux qu'il
  // nomme. Ajouter un cas d'usage ne demande donc aucun câblage ici.
  const instancier = (module) =>
    Object.fromEntries(
      Object.entries(module)
        .filter(([, Classe]) => typeof Classe === 'function')
        .map(([nom, Classe]) => [nom[0].toLowerCase() + nom.slice(1), new Classe(depots)]),
    );

  return {
    ...depots,
    useCases: {
      auth: instancier(auth),
      users: instancier(users),
      catalog: instancier(catalog),
      projects: instancier(projects),
      contact: instancier(contact),
    },
  };
};

export const container = createContainer();
export const useCases = container.useCases;

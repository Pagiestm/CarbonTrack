# Tests

153 tests, deux applications, quatre environnements d'exécution.

```sh
npm test                        # tout le dépôt
npm test -w @carbontrack/api    # API
npm test -w @carbontrack/web    # client
```

## Le principe

**Un test tourne dans l'environnement le plus pauvre qui lui suffit.** Pas de
navigateur pour tester une règle métier, pas de base pour tester une
validation. C'est plus rapide, et surtout c'est un garde-fou : si un test du
domaine se met à réclamer un DOM, c'est que le domaine a cessé d'être pur.

## Client — `apps/web/test/`

`vitest.config.js` déclare deux projets, choisis par dossier.

| Dossier       | Environnement | Ce qu'on y teste                                 |
| ------------- | ------------- | ------------------------------------------------ |
| `domain/`     | node          | entités : `Footprint`, `Project`, `User`, `Page` |
| `use-cases/`  | node          | cas d'usage, avec de faux dépôts                 |
| `data/`       | node          | traduction des réponses de l'API en entités      |
| `storage/`    | jsdom         | `localStorage`, fragment d'URL                   |
| `components/` | jsdom         | composants montés                                |
| `stores/`     | jsdom         | stores Pinia, conteneur remplacé                 |

### Les aides

`test/helpers/doubles.js` fournit des fabriques d'entités et un faux dépôt.

```js
const projectRepository = fauxDepot({ create: vi.fn().mockResolvedValue(unProjet()) });
await new CreateProject({ projectRepository }).execute({ name: 'P', materials: […] });
expect(projectRepository.create).toHaveBeenCalledWith(…);
```

Un test ne décrit que ce qui le concerne ; le reste vient des valeurs par
défaut. Quand une entité gagne un champ, c'est le seul fichier à toucher.

`fauxDepot` est un `Proxy` : toute méthode non fournie devient un espion qui
résout `undefined`. Inutile de déclarer les méthodes qu'on n'appelle pas.

`test/helpers/setup.js` n'est chargé que par le projet jsdom : il remplace
`RouterLink` et `RouterView` par des balises inertes et vide le `localStorage`
entre deux tests.

### Tester un store

Le store parle au conteneur, pas à l'API. On remplace donc le conteneur en
entier — c'est ce que permet la racine de composition :

```js
vi.mock('@/container.js', () => ({ useCases: casDUsage }));
```

Sans elle, il faudrait intercepter axios.

## API — `apps/api/test/`

| Dossier | Ce qu'on y teste                                    |
| ------- | --------------------------------------------------- |
| `unit/` | schémas zod, pagination, calcul d'empreinte, jetons |
| `http/` | routes montées avec supertest, sans base            |

Les tests HTTP montent l'application Express réelle : authentification, droits,
validation, limitation de débit, routes inconnues. **Aucune base n'est
nécessaire** — ces requêtes s'arrêtent avant Prisma. Les variables
d'environnement factices sont dans `vitest.config.js`.

## Ce qui n'est pas couvert

À dire franchement plutôt que de laisser croire à une couverture complète :

- **Les services de l'API** qui touchent Prisma ne sont pas testés : il
  faudrait une base de test et des transactions à dérouler.
- **Les pages complètes** du client ne sont pas montées, seulement les
  composants du kit. Les parcours sont vérifiés à la main dans un navigateur.
- **Aucun test de bout en bout** automatisé (Playwright ou équivalent).

## Ce que les tests ont déjà attrapé

Trois bugs réels, trouvés en écrivant les tests et non en production :

1. `CreateProject`, `UpdateProject` et `ResetPassword` **levaient de façon
   synchrone** au lieu de rejeter une promesse. Tous les `execute` renvoient
   maintenant une promesse.
2. `CreateProject` **jetait le contexte du chantier** (lieu, surface, type) que
   le formulaire envoyait : seuls le nom, la description et les matériaux
   passaient.
3. `LocalSessionRepository` testé en environnement node a révélé qu'il
   dépendait du navigateur — ce qui était attendu, mais le rangement du
   fichier ne le disait pas.

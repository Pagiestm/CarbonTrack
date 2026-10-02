# CarbonTrack

Application de calcul de l'empreinte carbone des matériaux de construction.
Elle aide à calculer, suivre et réduire l'empreinte carbone des matériaux
utilisés dans un projet de construction, et à gérer ces projets dans la durée.

En ligne sur **[carbontrack.theotimepagies.com](https://carbontrack.theotimepagies.com)**.

## Fonctionnalités

- **Base de matériaux** : empreinte carbone, fournisseur, prix et unité, classés par catégorie.
- **Calculateur de projet** : sélection des matériaux et des quantités, empreinte carbone totale.
- **Rapports** : visualisation des résultats d'un projet sous forme de graphiques.
- **Comptes** : inscription, connexion par mot de passe ou par Google, mot de passe oublié.
- **Administration** : gestion des catégories, des matériaux et des utilisateurs.

## Structure

Un monorepo npm (workspaces) : deux applications indépendantes, qui ne
communiquent qu'en HTTP.

```
apps/api/    API REST : Node.js 24, Express 5, Prisma 7, PostgreSQL
apps/web/    client : Vue 3, Vite 8, Tailwind CSS 4 — en clean architecture
docs/        documentation : architecture, modèle de données, déploiement
```

## Démarrer

### Avec Docker — rien à installer d'autre

```sh
cp apps/api/.env.example apps/api/.env   # puis renseigner JWT_SECRET
cp apps/web/.env.example apps/web/.env
docker compose up --build --watch
```

| Service                            | Adresse                                                                |
| ---------------------------------- | ---------------------------------------------------------------------- |
| client                             | <http://localhost:5173>                                                |
| API                                | <http://localhost:3000> (Swagger sur `/api-docs/`)                     |
| Adminer, pour parcourir la base    | <http://localhost:8081/?pgsql=db&db=CarbonTrack> (`postgres` / `root`) |
| Mailpit, qui intercepte les emails | <http://localhost:8026>                                                |

La base, les migrations et le rechargement à chaud sont pris en charge. Le
détail est dans [docs/deploiement/docker.md](./docs/deploiement/docker.md).

### Sans Docker

Il faut Node.js 24 et un PostgreSQL joignable.

```sh
npm install
cp apps/api/.env.example apps/api/.env   # puis renseigner DATABASE_URL et JWT_SECRET
cp apps/web/.env.example apps/web/.env
npm run build -w @carbontrack/api        # génère le client Prisma
npx -w @carbontrack/api prisma migrate dev

npm run dev:api                          # API    http://localhost:3000
npm run dev:web                          # client http://localhost:5173
```

## Commandes

| Commande          | Effet                              |
| ----------------- | ---------------------------------- |
| `npm run dev:api` | API avec rechargement à chaud      |
| `npm run dev:web` | client avec rechargement à chaud   |
| `npm run build`   | build de production du client      |
| `npm test`        | tests de toutes les applications   |
| `npm run lint`    | ESLint sur toutes les applications |

## Documentation

| Document                                                   | Contenu                                   |
| ---------------------------------------------------------- | ----------------------------------------- |
| [docs/outillage.md](./docs/outillage.md)                   | ESLint, Prettier, Husky, commitlint       |
| [docs/architecture.md](./docs/architecture.md)             | organisation du monorepo                  |
| [docs/merise/](./docs/merise/README.md)                    | modèle de données : MCD, MLD, MPD         |
| [docs/deploiement/docker.md](./docs/deploiement/docker.md) | Docker, en développement et en production |
| [docs/deploiement/render.md](./docs/deploiement/render.md) | hébergement sur Render                    |
| [apps/api/README.md](./apps/api/README.md)                 | l'API en détail                           |
| [apps/web/README.md](./apps/web/README.md)                 | le client en détail                       |

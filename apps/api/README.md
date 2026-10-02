# API CarbonTrack

API REST de CarbonTrack : comptes, catalogue de matériaux, projets et calcul de l'empreinte carbone.

## Technologies

- **Node.js 24** : le client Prisma généré est en TypeScript, et Node le charge directement.
- **Express 5** : un `throw` dans un handler asynchrone remonte jusqu'au gestionnaire d'erreurs.
- **Prisma 7** sur **PostgreSQL**, via l'adaptateur `@prisma/adapter-pg`.
- **zod** pour valider les entrées, **Swagger** pour la documentation.
- **Vitest** et **Supertest** pour les tests.

## Architecture

```
Dockerfile               image de l'API (cibles dev et runtime)
src/
├── server.js            démarrage et arrêt propre (SIGTERM)
├── app.js               assemblage : middlewares, routes, gestion d'erreurs
├── config/env.js        variables d'environnement, validées au démarrage
├── docs/swagger.js      documentation lue dans les commentaires @swagger des routes
├── modules/             un dossier par domaine
│   ├── auth/            inscription, connexion, Google, mot de passe oublié
│   ├── users/           profil (/profile) et liste des comptes (admin)
│   ├── catalog/         catégories et matériaux
│   ├── projects/        projets et calcul de l'empreinte (footprint.js)
│   └── contact/         formulaire de contact
├── shared/              code commun aux modules
│   ├── db/prisma.js     client Prisma unique
│   ├── http/            erreurs HTTP, validation, gestionnaire d'erreurs
│   ├── auth/            jetons JWT, requireAuth / requireAdmin
│   └── mail/            envoi d'emails et gabarits
├── templates/email/     gabarits MJML, compilés en HTML à l'exécution
└── generated/prisma/    client Prisma (généré, ignoré par git)
```

Chaque module découpe son code de la même façon :

| Fichier           | Rôle                                                    |
| ----------------- | ------------------------------------------------------- |
| `*.routes.js`     | chemins, middlewares, documentation Swagger             |
| `*.schemas.js`    | schémas zod des entrées                                 |
| `*.controller.js` | lit la requête validée (`req.valid`), répond            |
| `*.service.js`    | règles métier et accès à la base ; lève des `HttpError` |

Les erreurs ont toujours la forme `{ "error": "message", "details"?: [...] }`.

## Installation

Le plus simple est la pile Docker, qui fournit aussi PostgreSQL et applique les
migrations au démarrage — `docker compose up --watch` depuis la racine, détails dans
[docs/deploiement/docker.md](../../docs/deploiement/docker.md).

Sans Docker, il faut Node.js 24 et un PostgreSQL joignable. Depuis la racine du
dépôt :

```sh
npm install
cp apps/api/.env.example apps/api/.env   # puis renseigner les valeurs
npm run build -w @carbontrack/api         # génère le client Prisma
npx -w @carbontrack/api prisma migrate dev
```

## Commandes

| Commande (depuis la racine)         | Effet                                      |
| ----------------------------------- | ------------------------------------------ |
| `npm run dev:api`                   | serveur avec rechargement (`node --watch`) |
| `npm test -w @carbontrack/api`      | tests                                      |
| `npm run build -w @carbontrack/api` | génère le client Prisma                    |

Dans la pile Docker, les mêmes commandes passent par le conteneur, qui seul
voit la base : `docker compose exec api npx vitest run`,
`docker compose exec api npx prisma migrate dev --name ma_migration`.

L'API écoute sur le port 3000. La documentation est sur <http://localhost:3000/api-docs/>.

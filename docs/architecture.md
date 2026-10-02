# Architecture

CarbonTrack est un monorepo npm (workspaces). Un seul `package-lock.json`, à la
racine, et deux applications indépendantes.

```
CarbonTrack/
├── apps/
│   ├── api/              API REST : Node.js 24, Express 5, Prisma 7, PostgreSQL
│   │   ├── Dockerfile    cibles dev et runtime
│   │   └── src/          config, docs, modules/, shared/, templates/
│   └── web/              client : Vue 3, Vite 8, Tailwind CSS 4
│       ├── Dockerfile    cibles dev et runtime
│       ├── nginx.conf    serveur de l'image de production
│       └── src/          app/, api/, features/, shared/, assets/
├── docs/                 cette documentation
│   ├── merise/           modèle de données
│   └── deploiement/      Docker et Render
├── compose.yaml          pile de développement
├── compose.prod.yaml     pile de production
├── render.yaml           blueprint de l'hébergement Render
├── .github/workflows/    intégration continue
├── eslint.config.js      lint des deux applications
├── .prettierrc.json      formatage
├── commitlint.config.js  convention des messages de commit
└── .husky/               hooks git (pre-commit, commit-msg)
```

Il n'y a **pas de `.env` à la racine** : chaque application garde le sien
(`apps/api/.env`, `apps/web/.env`), et Docker Compose va les y chercher.
L'outillage, lui, fait le chemin inverse : une seule configuration à la racine
pour tout le dépôt (voir [outillage.md](./outillage.md)).

## La frontière entre les deux applications

Le client ne parle à l'API qu'en HTTP. **Aucun code n'est partagé** : pas de
paquet commun, pas de types partagés. Chacune peut être construite, testée et
déployée seule, et c'est ce qui permet au `render.yaml` de ne redéployer que le
service dont le dossier a changé.

Les deux applications se rencontrent en un seul point : l'adresse de l'API,
que le client lit dans `VITE_API_BASE_URL`.

## L'API : un monolithe modulaire

Un dossier par domaine dans `src/modules/` — `auth`, `users`, `catalog`,
`projects`, `contact` — et le même découpage dans chacun :

| Fichier           | Rôle                                                    |
| ----------------- | ------------------------------------------------------- |
| `*.routes.js`     | chemins, middlewares, documentation Swagger             |
| `*.schemas.js`    | schémas zod des entrées                                 |
| `*.controller.js` | lit la requête validée (`req.valid`), répond            |
| `*.service.js`    | règles métier et accès à la base ; lève des `HttpError` |

Ce que plusieurs modules partagent vit dans `src/shared/` : le client Prisma,
les erreurs HTTP, les jetons JWT, l'envoi d'emails. La configuration est
validée une fois au démarrage dans `src/config/env.js` — une variable manquante
fait échouer le lancement, pas la première requête.

Le détail est dans [apps/api/README.md](../apps/api/README.md).

## Le client : une organisation par fonctionnalités

`src/features/` suit les domaines de l'application plutôt que la nature des
fichiers : une page et ses composants vivent ensemble. `src/api/` reprend les
modules de l'API, un fichier par module, tous construits sur le même client
axios. `src/shared/` porte ce qui traverse les domaines.

Le détail est dans [apps/web/README.md](../apps/web/README.md).

## Le modèle de données

Conçu avec la méthode Merise, documenté dans [docs/merise](./merise/README.md),
et traduit en `apps/api/prisma/schema.prisma`. Les migrations sont versionnées
dans `apps/api/prisma/migrations/` et appliquées au démarrage en production.

## Exécution

| Contexte             | Comment                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------- |
| développement local  | `npm run dev:api` et `npm run dev:web`                                                   |
| développement Docker | `docker compose up` — avec Adminer et Mailpit, voir [docker.md](./deploiement/docker.md) |
| production Docker    | `compose.prod.yaml`, client servi par nginx                                              |
| production hébergée  | Render — voir [render.md](./deploiement/render.md)                                       |

## Outillage

ESLint, Prettier, Husky et commitlint sont configurés une seule fois, à la
racine, et couvrent les deux applications : `npm run lint` et
`npm run format` depuis la racine suffisent. Le détail est dans
[outillage.md](./outillage.md).

Les deux chemins de production partagent le même principe : le client et l'API
répondent sur une origine unique, `/api` étant réécrit vers l'API. Le client
n'a donc jamais besoin de connaître l'adresse publique de l'API, et il n'y a
pas de CORS en jeu.

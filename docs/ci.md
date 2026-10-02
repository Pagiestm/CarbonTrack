# Intégration continue

`.github/workflows/ci.yml` tourne à chaque push sur `master` et à chaque pull
request. Deux travaux en parallèle :

## `verifier`

La même séquence que ce qu'on joue en local, dans cet ordre :

| Étape           | Commande                            |
| --------------- | ----------------------------------- |
| Lint            | `npm run lint`                      |
| Format          | `npm run format:check`              |
| Client Prisma   | `npm run build -w @carbontrack/api` |
| Tests           | `npm test`                          |
| Build du client | `npm run build`                     |

La génération du client Prisma vient **avant** les tests : le code de l'API
l'importe, sans lui rien ne démarre. Elle ne demande pas de base — les tests
s'arrêtent avant, et leurs variables d'environnement sont dans
`apps/api/vitest.config.js`.

La version de Node vient de `.node-version`, le même fichier que celui lu par
Render.

## `images`

Construit les deux images de production (`apps/api/Dockerfile` et
`apps/web/Dockerfile`, cible `runtime`) sans les publier : une erreur de
Dockerfile se voit en CI plutôt qu'au déploiement. Le cache est celui de
GitHub Actions.

## Localement

```sh
npm run lint && npm run format:check && npm test && npm run build
```

Les hooks git en attrapent déjà une partie avant le commit : voir
[outillage.md](./outillage.md).

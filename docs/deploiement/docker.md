# Docker

Deux piles, décrites par deux fichiers Compose à la racine :

| Fichier             | Usage                                                           |
| ------------------- | --------------------------------------------------------------- |
| `compose.yaml`      | développement : base, API en rechargement à chaud, serveur Vite |
| `compose.prod.yaml` | production : images construites, client servi par nginx         |

Les `Dockerfile` vivent à côté de l'application qu'ils construisent
(`apps/api/Dockerfile`, `apps/web/Dockerfile`), mais **leur contexte de build
est la racine du dépôt** : le monorepo npm n'a qu'un `package-lock.json`, à la
racine, et `npm ci` en a besoin. D'où le `-f` dans toutes les commandes.

## Configuration

**Il n'y a pas de `.env` à la racine.** Chaque application garde le sien, et
Compose va le chercher là où il est :

```sh
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

C'est le même fichier qu'en développement hors Docker, et le fichier doit
exister : sans lui, Compose s'arrête en le nommant, ce qui vaut mieux qu'une
erreur de validation au démarrage de l'API.

Ce qui décrit le conteneur plutôt que la machine — `DATABASE_URL`, qui vise le
service `db` et non `localhost`, ainsi que `FRONTEND_URL`, `NODE_ENV` et
`PORT` — est écrit dans `environment:` du service, **qui l'emporte sur
`env_file:`**. Le même `apps/api/.env` sert donc aux deux modes sans avoir à le
modifier entre les deux.

| Mode                | Ce que Compose prend dans `apps/api/.env`      |
| ------------------- | ---------------------------------------------- |
| `compose.yaml`      | `JWT_SECRET`, `SMTP_*`, `GOOGLE_*`             |
| `compose.prod.yaml` | tout, `DATABASE_URL` et `POSTGRES_*` comprises |

En développement, seul `JWT_SECRET` doit être rempli : les emails et la
connexion Google restent inertes tant que leurs variables sont vides. En
production, `apps/api/.env` configure la pile entière, base comprise — les
`POSTGRES_*` y ont une section dédiée, et `DATABASE_URL` doit en reprendre les
valeurs en visant l'hôte `db`.

Le client a le sien, `apps/web/.env`, qui ne contient que `VITE_API_BASE_URL`.
Compose le lui passe tel quel en développement. En production il n'en a pas
besoin : l'adresse est figée au build (voir plus bas).

## Développement

```sh
docker compose up --build --watch   # --build au premier lancement seulement
```

`--watch` active le rechargement à chaud : voir
[Rechargement à chaud](#rechargement-à-chaud). Sans lui, la pile tourne sur
les sources copiées dans l'image au dernier build.

| Service | Adresse                                          | Rôle                                   |
| ------- | ------------------------------------------------ | -------------------------------------- |
| client  | <http://localhost:5173>                          | Vite, rechargement à chaud             |
| API     | <http://localhost:3000>                          | Swagger sur `/api-docs/`               |
| Adminer | <http://localhost:8081/?pgsql=db&db=CarbonTrack> | parcourir la base                      |
| Mailpit | <http://localhost:8026>                          | emails envoyés par l'API               |
| base    | `localhost:5432`                                 | PostgreSQL, pour un client SQL externe |

### Adminer

Le driver, le serveur et la base sont pré-remplis par l'URL ci-dessus ; il
reste à saisir `postgres` / `root`. Les tables sont celles de Prisma : `User`,
`Category`, `Material`, `Project`, `ProjectMaterial`, `InvalidToken`.

### Mailpit

L'API y envoie tous ses emails — inscription, mot de passe oublié, contact —
et **aucun ne part vraiment**. `compose.yaml` force `SMTP_HOST=mailpit` et
`SMTP_PORT=1025` par-dessus `apps/api/.env` : rien à configurer, et les
identifiants Mailtrap du fichier restent inutilisés sous Docker.

L'interface est sur le port 8026 et non 8025, le port par défaut de Mailpit :
il est souvent déjà pris par une autre pile. Le port SMTP n'est pas publié sur
l'hôte, seule l'API s'en sert.

Une base fraîche est vide : sans catalogue, impossible de composer un projet.
Un jeu de données de départ la remplit, avec un compte de démonstration
(`demo@carbontrack.fr` / `Motdepasse1!`, administrateur) :

```sh
docker compose exec api npm run seed          # ajoute ce qui manque
docker compose exec api npm run seed:reset    # vide d'abord, puis remplit
```

Le script est idempotent : on peut le rejouer sans créer de doublons. Il
génère 10 catégories, 56 matériaux, 26 comptes et une soixantaine de projets
étalés sur l'année, de quoi faire vivre les graphiques du tableau de bord. La
graine du générateur est fixe : deux exécutions sur une base vide donnent les
mêmes données.

`seed:reset` ne touche qu'aux comptes générés (`@carbontrack.test`) et au
compte de démonstration : les comptes réels sont conservés.

**En production, seul le catalogue** se remplit : le compte de démonstration
est administrateur et son mot de passe est public, dans ce dépôt.

```sh
DATABASE_URL="<url de production>" npm run seed:catalogue -w @carbontrack/api
```

Comme le reste du script, `seed:catalogue` est idempotent : il n'ajoute que les
catégories et matériaux absents.

Au démarrage, l'API génère le client Prisma puis applique les migrations.

### Rechargement à chaud

Les sources **ne sont pas montées** depuis l'hôte. Sous Docker Desktop pour
Windows, un dossier de `C:\` monté dans un conteneur passe par un système de
fichiers (9p) qui ne transmet pas les notifications de modification : le
fichier change bien dans le conteneur, mais ni Vite ni l'API ne s'en
aperçoivent.

`compose.yaml` décrit donc une section `develop.watch` : avec `--watch`,
Compose recopie chaque fichier modifié dans le conteneur, où les notifications
fonctionnent normalement.

| Modifié sur l'hôte                                  | Effet dans le conteneur                                |
| --------------------------------------------------- | ------------------------------------------------------ |
| `apps/*/src`, `apps/*/test`, `apps/web/index.html`… | recopié ; Vite recharge la page, nodemon relance l'API |
| `vite.config.js`, `apps/api/prisma.config.js`       | recopié, puis conteneur redémarré                      |
| un `package.json`, `package-lock.json`              | image reconstruite                                     |

L'API tourne sous `nodemon` et non `node --watch` : Compose remplace les
fichiers au lieu de les réécrire, et `node --watch` ne voit alors que le
premier changement de chaque fichier.

`node_modules` est celui de l'image : les binaires natifs y sont compilés pour
Linux. Après un `npm install`, `--watch` reconstruit l'image tout seul.

```sh
docker compose logs -f api              # suivre un service
docker compose exec api sh              # ouvrir un shell dans l'API
docker compose down                     # arrêter, en gardant la base
docker compose down -v                  # arrêter et effacer la base
```

### Prisma

`apps/api/prisma/` est le seul dossier **monté** depuis l'hôte : une migration
créée dans le conteneur s'écrit directement dans le dépôt. Le conteneur seul
voit la base. Depuis l'hôte, `localhost:5432` peut viser un autre PostgreSQL
installé sur la machine.

```sh
docker compose exec api npx prisma migrate dev --name ma_migration
docker compose restart api        # relance l'API sur le client régénéré
```

Comme le dossier est monté et non recopié, une modification de
`schema.prisma` ne relance rien d'elle-même : c'est `migrate dev` qui
l'applique.

Les tests aussi :

```sh
docker compose exec api npx vitest run
```

## Production

```sh
docker compose -f compose.prod.yaml up -d --build
```

Le client répond sur <http://localhost:8080>.
L'API n'est pas publiée : elle n'est joignable que dans le réseau Compose, par
le nginx du client qui réécrit `/api/*` vers elle. Client et API partagent donc
une origine, exactement comme [sur Render](./render.md), et CORS ne rentre pas
en jeu.

L'adresse de l'API est figée dans le bundle **au moment du build** : Vite
remplace les `import.meta.env.VITE_*` par leur valeur. C'est pourquoi
`VITE_API_BASE_URL` est un argument de build (`args:`) et non une variable
d'exécution. La changer impose de reconstruire le client.

Au démarrage, l'API joue `prisma migrate deploy` avant d'écouter. Les deux
images portent un `HEALTHCHECK`, et `compose.prod.yaml` enchaîne les
dépendances dessus : le client n'ouvre pas tant que l'API n'est pas saine.

### Les images

Les deux `Dockerfile` sont multi-étapes et exposent la même paire de cibles :

| Cible     | Contenu                                                       |
| --------- | ------------------------------------------------------------- |
| `dev`     | dépendances complètes et sources, tenues à jour par `--watch` |
| `runtime` | image finale, par défaut                                      |

Côté API, `runtime` repart d'une installation `--omit=dev` et ne garde que le
client Prisma généré et les sources ; elle tourne sous l'utilisateur `node`.
La CLI `prisma` reste une dépendance de production : `start:prod` en a besoin
pour les migrations.

Côté client, `runtime` est un `nginx` qui ne contient que le `dist` de Vite et
`apps/web/nginx.conf` : fichiers hachés mis en cache un an, `index.html` jamais,
le reste des adresses renvoyé sur `index.html` pour le routeur Vue.

Pour construire une image seule :

```sh
docker build -f apps/api/Dockerfile -t carbontrack-api .
docker build -f apps/web/Dockerfile --build-arg VITE_API_BASE_URL=/api -t carbontrack-web .
```

## Dépannage

| Symptôme                                             | Cause                                                                                           |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `port is already allocated`                          | un PostgreSQL tourne déjà sur l'hôte : arrêter celui-ci, ou retirer le `ports:` du service `db` |
| `Cannot find module` après un `npm install`          | le `node_modules` de l'image est périmé : `docker compose up --build --watch`                   |
| une modification n'apparaît pas                      | la pile a été lancée sans `--watch` : `docker compose up --watch`                               |
| `env file ... not found`                             | `cp apps/api/.env.example apps/api/.env`                                                        |
| `Configuration invalide : JWT_SECRET`                | `JWT_SECRET` est vide dans `apps/api/.env`                                                      |
| en production, l'API ne joint pas la base            | `DATABASE_URL` vise `localhost` au lieu de `db`, ou ne reprend pas les `POSTGRES_*`             |
| la base semble vide après une mise à jour de l'image | `docker compose down -v` a effacé le volume `db-data`                                           |

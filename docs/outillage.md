# Outillage

ESLint, Prettier, Husky et commitlint sont configurés **une seule fois, à la
racine**, et couvrent les deux applications. Rien de tout cela n'est installé
dans `apps/api` ou `apps/web` : les dépendances d'outillage sont dans le
`package.json` de la racine, et les workspaces npm les rendent disponibles
partout.

| Fichier                | Rôle                                                |
| ---------------------- | --------------------------------------------------- |
| `eslint.config.js`     | règles de lint, un bloc par application             |
| `.prettierrc.json`     | style de formatage                                  |
| `.prettierignore`      | ce que Prettier ne touche pas (généré, migrations…) |
| `commitlint.config.js` | convention des messages de commit                   |
| `.husky/`              | hooks git : `pre-commit` et `commit-msg`            |

## Commandes

| Commande               | Effet                                          |
| ---------------------- | ---------------------------------------------- |
| `npm run lint`         | ESLint sur tout le dépôt                       |
| `npm run lint:fix`     | ESLint avec correction automatique             |
| `npm run format`       | Prettier réécrit tout le dépôt                 |
| `npm run format:check` | Prettier vérifie sans rien écrire (pour la CI) |
| `npm test`             | tests de toutes les applications               |

## ESLint

Une configuration plate unique. Les blocs se cumulent dans l'ordre, chacun
limité aux fichiers qu'il nomme :

- `apps/api/**/*.js` : globales Node.
- `apps/web/**/*.{js,vue}` : globales navigateur, plus `eslint-plugin-vue`
  (`flat/essential`).
- `*.config.js` : globales Node, y compris côté client — `vite.config.js`
  tomberait sinon dans le bloc navigateur.
- `eslint-config-prettier` **en dernier**, pour neutraliser les règles de style
  que Prettier gère déjà. Les deux outils ne se contredisent donc jamais.

Sont ignorés : `dist`, `coverage`, le client Prisma généré
(`apps/api/src/generated`) et les gabarits MJML, que Prettier prendrait pour du
HTML.

`no-unused-vars` est réglé avec `ignoreRestSiblings` et un préfixe `_` toléré :
retirer un champ par déstructuration — `const { password: _hash, ...reste } =
user` — est un idiome volontaire, pas un oubli.

## Prettier

Guillemets simples, point-virgules, virgule finale, 100 colonnes. En plus des
dossiers générés, `.prettierignore` écarte les migrations SQL écrites par
Prisma et les fichiers du modèle Merise.

## Husky et commitlint

Les hooks sont installés par le script `prepare`, que npm joue à chaque
`npm install`. Rien à lancer à la main après un clone.

Ce script s'écrit `husky || true` : npm le joue aussi dans les images Docker et
en CI, où husky n'est pas installé et où il n'y a de toute façon pas de dépôt
git. Sans ce garde-fou, `npm ci` échouerait avec `sh: husky: not found` et la
construction des images s'arrêterait là.

| Hook         | Ce qu'il fait                                                                     |
| ------------ | --------------------------------------------------------------------------------- |
| `pre-commit` | `lint-staged` : ESLint `--fix` puis Prettier, sur les fichiers indexés uniquement |
| `commit-msg` | `commitlint` : refuse un message hors convention                                  |

`lint-staged` ne travaille que sur ce qui est indexé : un commit ne reformate
jamais un fichier auquel on n'a pas touché.

Les messages suivent [Conventional Commits](https://www.conventionalcommits.org/),
déjà l'usage du dépôt :

```
build(docker): ajouter les piles de développement et de production
fix(api): corriger la redirection Google
docs: décrire l'outillage à la racine
```

Types admis : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore`, `revert`. Le sujet reste en minuscules, à l'impératif.
Pour passer outre ponctuellement : `git commit --no-verify`.

## Renovate

[Renovate](https://docs.renovatebot.com/) tient les dépendances à jour :
paquets npm, images Docker, actions GitHub et version de Node. Sa
configuration est dans `renovate.json`, à la racine.

| Mise à jour            | Ce que fait Renovate                                 |
| ---------------------- | ---------------------------------------------------- |
| mineure ou correctif   | une seule PR groupée, fusionnée seule si la CI passe |
| majeure                | une PR par paquet, à relire et fusionner à la main   |
| paquet en 0.x, mineure | PR groupée « paquets 0.x », à relire                 |
| `package-lock.json`    | rafraîchi chaque lundi matin                         |
| faille de sécurité     | PR immédiate, sans le délai habituel                 |

Une version doit avoir trois jours avant d'être proposée : le temps qu'une
publication fautive soit retirée. Node ne monte que vers une LTS (majeure
paire), `.node-version` et les images Docker ensemble. PostgreSQL ne change
jamais de majeure seul : il faut migrer les données du volume.

Une PR fusionnée arrive sur `master`, et donc **en production** par le
déploiement automatique de Render : la CI (lint, format, tests, build, images
Docker) est le seul garde-fou avant. Le tableau de bord des mises à jour est
une issue GitHub, « Dependency Dashboard », tenue par Renovate.

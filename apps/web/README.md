# Client CarbonTrack

Application Vue 3, organisée en **clean architecture** : trois couches, une
règle de dépendance. Le détail et le pourquoi sont dans
[docs/architecture-client.md](../../docs/architecture-client.md).

## Technologies

- **Vue 3.5** et **vue-router 5**
- **Pinia** pour l'état partagé
- **Vite 8**
- **Tailwind CSS 4** : le thème est dans `src/assets/tailwind.css` (`@theme`)
- **lucide-vue-next** pour les icônes, **Chart.js** pour les graphiques
- **Inter** et **Space Grotesk**, auto-hébergées (`@fontsource-variable`)
- **Vitest** pour les tests du domaine

## Architecture

```
src/
├── domain/               le métier, zéro dépendance technique
│   ├── entities/         User, Project, Material, Category, Footprint, Session
│   ├── repositories/     les contrats dont le métier a besoin
│   └── use-cases/        une action métier = une classe, une méthode execute()
│
├── data/                 les détails techniques
│   ├── http/             client axios
│   ├── models/           traduction des réponses de l'API en entités
│   ├── repositories/     implémentations HTTP des contrats
│   └── storage/          la session dans le localStorage
│
├── presentation/         Vue
│   ├── app/              main.js, App.vue, routeur, page 404
│   ├── stores/           session, catalogue, projets (Pinia)
│   ├── components/       communs + kit d'interface dans ui/
│   └── modules/          home, auth, projects, profile, contact, admin
│
├── container.js          racine de composition : qui implémente quoi
└── assets/tailwind.css   jetons du thème
```

**La règle** : `presentation` → `domain` ← `data`. Le domaine ne pointe vers
personne. Aucun fichier de `domain/` ne mentionne `vue`, `axios`, `window` ou
`localStorage`.

Les imports passent par l'alias `@/`. Toutes les pages, sauf l'accueil, sont
chargées à la demande.

## Le kit d'interface

`presentation/components/ui/` : `AppButton`, `AppField`, `AppCard`,
`AppAlert`, `AppShell`, `PageHeader`, `EmptyState`, `ConfirmDialog`,
`FootprintBadge`, `GoogleLogo`, plus `chart-theme.js` pour les graphiques.

Tout passe par les jetons du thème — aucune couleur en dur dans un composant.
`FootprintBadge` colore une empreinte selon le **niveau défini par l'entité
`Footprint`** : la couleur suit le métier, pas l'inverse.

## Installation

La pile Docker démarre le client avec l'API et la base en une commande —
`docker compose up` depuis la racine, détails dans
[docs/deploiement/docker.md](../../docs/deploiement/docker.md).

Sans Docker, depuis la racine du dépôt :

```sh
npm install
cp apps/web/.env.example apps/web/.env
```

`.env` ne contient que l'adresse de l'API : `http://localhost:3000` en
développement. En production, l'adresse est figée dans le bundle au moment du
build : Render la fournit par `VITE_API_BASE_URL=/api` (voir `render.yaml`),
l'image Docker par l'argument de build du même nom. Dans les deux cas, `/api`
est réécrit vers l'API, qui partage donc l'origine du client.

## Commandes

| Commande (depuis la racine)    | Effet                                    |
| ------------------------------ | ---------------------------------------- |
| `npm run dev:web`              | serveur de développement                 |
| `npm run build`                | build de production dans `apps/web/dist` |
| `npm test -w @carbontrack/web` | tests du domaine et des cas d'usage      |
| `npm run lint`                 | ESLint (configuré à la racine)           |

# Client CarbonTrack

Application Vue 3 de CarbonTrack.

## Technologies

- **Vue 3.5** et **vue-router 5**
- **Vite 8**
- **Tailwind CSS 4** : le thème est dans `src/assets/tailwind.css` (`@theme`).
- **Chart.js** pour les graphiques
- **ESLint 10** (`eslint.config.js`)

## Architecture

```
src/
├── app/                 point d'entrée (main.js), App.vue, routeur, page 404
├── api/                 un fichier par module de l'API
│   ├── http.js          client axios : ajoute le jeton, remonte le message d'erreur
│   ├── auth.js          /auth, /password-reset
│   ├── users.js         /profile
│   ├── catalog.js       /categories, /materials
│   ├── projects.js      /projects
│   └── contact.js       /contact
├── features/            pages et composants par domaine
│   ├── home/
│   ├── auth/            connexion, inscription, mot de passe oublié
│   ├── contact/
│   ├── profile/
│   ├── projects/
│   └── admin/           tableau de bord, catégories, matériaux
├── shared/              commun à plusieurs domaines
│   ├── auth/session.js  jeton de session (localStorage)
│   └── components/      barre de navigation, pied de page, alertes…
└── assets/
```

Les imports passent par l'alias `@/` (par exemple `@/api/projects`). Toutes les pages, sauf l'accueil, sont chargées à la demande.

## Installation

Depuis la racine du dépôt :

```sh
npm install
cp apps/web/.env.example apps/web/.env
```

`.env` ne contient que l'adresse de l'API : `http://localhost:3000` en développement. En production, Render fournit `VITE_API_BASE_URL=/api` au moment du build (voir `render.yaml`).

## Commandes

| Commande (depuis la racine)            | Effet                                  |
| -------------------------------------- | -------------------------------------- |
| `npm run dev:web`                      | serveur de développement               |
| `npm run build`                        | build de production dans `apps/web/dist` |
| `npm run lint -w @carbontrack/web`     | ESLint                                 |

# CarbonTrack - Application de Calcul de l'Empreinte Carbone des Matériaux de Construction

## Présentation
CarbonTrack est une application innovante destinée à aider les personnes à calculer, suivre et réduire l'empreinte carbone des matériaux utilisés dans leurs projets de construction. Elle permet une gestion efficace des projets tout en favorisant des pratiques de construction durables.

## Fonctionnalités Principales
- **Base de données des matériaux** : Informations sur l'empreinte carbone des différents matériaux de construction.
- **Calculateur de projet** : Interface pour sélectionner les matériaux en fonction de leurs catégories et calculer l'empreinte carbone totale de votre projet.
- **Rapports et recommandations** : Génération de rapports détaillés avec des graphiques.

## Pages de l'Application
- **Page d'accueil** : Présentation de l'application et de ses fonctionnalités.
- **Page de connexion et d'inscription** : Formulaires pour les utilisateurs existants et nouveaux.
- **Page Projet** : Vue d'ensemble des projets, accès rapide aux projets récents.
- **Page de création et de gestion de projet** : Formulaire de création de projet, sélection des matériaux, calcul de l'empreinte carbone.
- **Page de visualisation des rapports de vos projets** : Rapports détaillés, graphiques, visualisations des données.
- **Page de profil utilisateur** : Informations personnelles, modification.
- **Page de gestion des matériaux (Admin)** : Liste des matériaux, formulaire pour leur gestion, détails incluant l'empreinte carbone.
- **Page de gestion des catégories (Admin)** : Liste des catégories, formulaire pour leur gestion.

## Architecture
Un monorepo npm (workspaces) qui sépare le client et l'API :

```
apps/
├── api/   API REST : Node.js 24, Express 5, Prisma 7, PostgreSQL
└── web/   client : Vue 3, Vite 8, Tailwind CSS 4
docs/      déploiement
Documents/ modèle de données (Merise)
```

- **API** : un monolithe modulaire. Chaque domaine (`auth`, `users`, `catalog`, `projects`, `contact`) a ses routes, ses schémas de validation, son contrôleur et son service. Le code commun (base, erreurs, authentification, emails) est dans `shared/`. Voir [apps/api](./apps/api/README.md).
- **Client** : organisé par fonctionnalités (`features/`). La couche `api/` reprend les modules de l'API, un fichier par module. Voir [apps/web](./apps/web/README.md).
- Le client ne parle à l'API qu'en HTTP. Aucun code n'est partagé entre les deux applications.

## Points à Développer
- **Gestion des utilisateurs** : Authentification avec JWT (Auth0 à voir).
- **UI/UX** : Design intuitif et convivial.
- **Sécurité** : Protection des données des utilisateurs.


## Base de données
Consultez le fichier complet des schémas de la base de données [ici](./Documents/Merise.md).

## Installation du projet
```sh
npm install                       # installe les deux applications
npm run build -w @carbontrack/api # génère le client Prisma
npm run dev:api                   # API sur http://localhost:3000
npm run dev:web                   # client sur http://localhost:5173
```

Avant le premier lancement, copier les `.env.example` en `.env` dans `apps/api` et `apps/web`. Le détail est dans le README de [l'API](./apps/api/README.md) et dans celui du [client](./apps/web/README.md).

## Déploiement
Le site est en ligne sur [carbontrack.theotimepagies.com](https://carbontrack.theotimepagies.com), hébergé gratuitement sur Render à partir du fichier `render.yaml` : voir [docs/deploiement-render.md](./docs/deploiement-render.md).


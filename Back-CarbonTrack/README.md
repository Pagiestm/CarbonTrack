# Documentation Backend de CarbonTrack

## Introduction

CarbonTrack est une application destinée à aider les utilisateurs à calculer, suivre et réduire l'empreinte carbone des matériaux utilisés dans leurs projets de construction. Cette documentation couvre la configuration et l'utilisation du backend de l'application.

## Technologies Utilisées

- **Node.js** : Environnement d'exécution JavaScript.
- **Express** : Framework web pour Node.js.
- **Prisma** : ORM pour interagir avec la base de données.
- **PostgreSQL** : Système de gestion de base de données relationnelle.
- **Swagger** : Outil pour générer et consulter la documentation de l'API.

## Installation et Configuration

### Installation des Dépendances

Pour installer les dépendances du projet, exécutez la commande suivante :

```sh
npm install
```

### Configuration de l'Environnement

Créez un fichier .env à la racine du projet et ajoutez-y la variable d'environnement suivante :


```sh
DATABASE_URL="postgresql://postgres:root@localhost:5432/CarbonTrack"
```

Le backend utilise PostgreSQL comme base de données. Assurez-vous que PostgreSQL est installé et configuré sur votre machine.

### Migration de la Base de Données

Pour appliquer les migrations de la base de données, utilisez Prisma avec la commande suivante :

```sh
npx prisma migrate dev
```

### Démarrage du Serveur

Pour démarrer le serveur, utilisez la commande suivante :

```sh
npm run start
```

Le serveur sera démarré sur le port 3000 par défaut.

### Documentation de l'API

La documentation de l'API est disponible à l'adresse suivante :

```sh
http://localhost:3000/api-docs/
```

Swagger est utilisé pour générer et consulter la documentation de l'API.
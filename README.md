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

## Architecture Technique
### Backend (Node.js, Express, Prisma)
- **Configuration du serveur** : API REST avec Express.
- **Routes et contrôleurs** :
  - Authentification : Inscription, connexion, déconnexion.
  - Gestion des matériaux : CRUD pour les matériaux.
  - Gestion des catégories : CRUD pour les catégories.
  - Gestion des projets : CRUD, calcul de l'empreinte carbone.

### Frontend (Vue.js)
- **Configuration du projet** : Création avec Vue CLI.
- **Composants** : Composants réutilisables pour l'interface.
- **Services API** : Interaction avec l'API backend.
- **Routes frontend** : Navigation avec Vue Router.

## Points à Développer
- **Gestion des utilisateurs** : Authentification avec JWT (Auth0 à voir).
- **UI/UX** : Design intuitif et convivial.
- **Sécurité** : Protection des données des utilisateurs.


## Base de données
Consultez le fichier complet des schémas de la base de données [ici](./Documents/Merise.md).

## Installation du projet
Consultez l'installation du frontend [ici](./Front-CarbonTrack/README.md).

Consultez l'installation du backend [ici](./Back-CarbonTrack/README.md).


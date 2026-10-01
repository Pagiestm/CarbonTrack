# Déploiement sur Render

Hébergement gratuit, sans carte bancaire, à partir du `render.yaml` à la racine.

| Brique         | Où                                             | Gratuit                                  |
| -------------- | ---------------------------------------------- | ---------------------------------------- |
| API Express    | Render, web service Node `carbontrack-api`     | 512 Mo, veille après 15 min sans requête |
| Client Vue     | Render static site `carbontrack`               | illimité, ne dort jamais                 |
| PostgreSQL     | Neon, ou l'instance Render déjà en place       | 0,5 Go                                   |

Le site répond sur `https://carbontrack.theotimepagies.com`. Les appels `/api/*`
sont réécrits vers l'API par le CDN de Render : client et API partagent la
même origine, et le client ne connaît l'API que par `VITE_API_BASE_URL=/api`.

## 1. Créer les services

Dans le dashboard Render : **New** › **Blueprint**, choisir le dépôt
`Pagiestm/CarbonTrack`, branche `master`. Render lit `render.yaml` et crée les
deux services. Les variables marquées `sync: false` sont demandées à la
création :

| Variable                                     | Valeur                                                           |
| -------------------------------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`                               | URL PostgreSQL, avec `?sslmode=require`                          |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`   | identifiants OAuth de la console Google Cloud                     |
| `EMAIL_USER`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | compte d'envoi des emails                     |

`JWT_SECRET` est généré par Render. `PROD_FRONTEND_URL` et
`GOOGLE_REDIRECT_URI` sont fixés dans le fichier.

Au démarrage, l'API joue `prisma migrate deploy` puis écoute sur le port fourni
par Render ; `/health` sert de contrôle de vie.

## 2. Connexion Google

Dans la console Google Cloud, identifiants OAuth du projet, ajouter :

- URI de redirection autorisée : `https://carbontrack-api-3s89.onrender.com/auth/google/callback`
- Origine JavaScript autorisée : `https://carbontrack.theotimepagies.com`

Sans cela, Google refuse la connexion avec `redirect_uri_mismatch`.

## 3. Nom de domaine

Le site statique est déclaré sur `carbontrack.theotimepagies.com` dans
`render.yaml` sous `domains:`. Côté DNS, le domaine est géré par Vercel :
**Domains** › `theotimepagies.com` › **DNS Records** › `CNAME`, nom
`carbontrack`, valeur `carbontrack.onrender.com`. Render émet le certificat
quelques minutes après la propagation.

## 4. Garder l'API éveillée

L'instance gratuite s'endort après 15 minutes sans requête et met 30 à 60 s à
se réveiller. Un moniteur UptimeRobot sur
`https://carbontrack-api-3s89.onrender.com/health`, toutes les 5 minutes, l'évite.

## Limites à connaître

- Render bloque les ports SMTP sortants 25, 465 et 587 sur les instances
  gratuites. Un compte SMTP sur un autre port (Mailtrap en 2525, par exemple)
  passe ; sinon il faut un envoi par API HTTP.
- L'API lit le gabarit d'email dans `Front-CarbonTrack/src/components/email` :
  le dépôt entier est cloné par Render, le chemin reste valable.
- Le plan gratuit compte 750 heures par mois et par compte : une API qui ne
  dort jamais en consomme environ 720, à partager avec les autres services.

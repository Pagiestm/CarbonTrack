# syntax=docker/dockerfile:1

# Contexte de build : la RACINE du dépôt, le monorepo n'ayant qu'un
# package-lock.json.
#   docker build -f apps/api/Dockerfile -t carbontrack-api .

ARG NODE_VERSION=24-alpine

# npm ci exige le manifeste de chaque workspace déclaré, même celui qu'on
# n'installe pas. Les copier seuls garde la couche en cache tant que les
# dépendances ne bougent pas.
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci -w @carbontrack/api

# compose.yaml monte les sources par-dessus : seul node_modules vient d'ici.
FROM deps AS dev
ENV NODE_ENV=development
COPY apps/api apps/api
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["node", "--watch", "src/server.js"]

FROM deps AS build
COPY apps/api apps/api
RUN npm run build -w @carbontrack/api

# La CLI prisma reste en production : start:prod joue `prisma migrate deploy`.
FROM deps AS prod-deps
RUN npm ci -w @carbontrack/api --omit=dev

FROM node:${NODE_VERSION} AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY package.json ./
COPY --from=build /app/apps/api ./apps/api
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
WORKDIR /app/apps/api
CMD ["npm", "run", "start:prod"]

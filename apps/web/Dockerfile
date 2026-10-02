# syntax=docker/dockerfile:1

ARG NODE_VERSION=24-alpine
ARG NGINX_VERSION=1.29-alpine

FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci -w @carbontrack/web

FROM deps AS dev
ENV NODE_ENV=development
COPY apps/web apps/web
WORKDIR /app/apps/web
EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0"]

FROM deps AS build
COPY apps/web apps/web
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build -w @carbontrack/web

FROM nginx:${NGINX_VERSION} AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

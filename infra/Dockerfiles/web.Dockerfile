# syntax=docker/dockerfile:1.7-labs
FROM node:20-alpine AS build
WORKDIR /app
COPY web ./web
WORKDIR /app/web
RUN npm ci && npm run build -- --configuration=production

FROM nginx:1.27-alpine
COPY infra/nginx/web.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/web/dist/web /usr/share/nginx/html
EXPOSE 80

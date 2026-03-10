# DevOps & Deployment Plan

## Repository Layout (monorepo)
```
PetCareSystem/
├── backend/              # Spring Boot project (Gradle)
├── web/                  # Angular workspace
├── miniapp/              # WeChat Mini Program source
├── infra/
│   ├── docker-compose.yml
│   ├── Dockerfiles/
│   ├── env.example
│   └── scripts/          # helper scripts (db migration, deploy)
└── docs/
```

## Build Pipelines
- **Backend**: Gradle tasks `build`, `test`, `bootJar`. Dockerfile multi-stage (builder + runtime). Flyway migrations run on app start.
- **Web**: `npm install && ng build --configuration=production`, output served via Nginx container.
- **Miniapp**: Built via WeChat DevTools; CI can lint/tsc but release handled manually.

## Docker Compose Stack
File: `infra/docker-compose.yml`

Services:
1. `mysql`: `mysql:8.0`, volume `mysql-data`, env from `.env` (root pass, db name).
2. `backend`: builds from `backend/Dockerfile`. Env:
   - `SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/petcare`
   - `SPRING_DATASOURCE_USERNAME/pw`
   - `OPENAI_API_KEY`, `WECHAT_APP_ID`, `WECHAT_APP_SECRET`
   - `REMINDER_LEAD_DAYS=7`
3. `web`: builds from `web/Dockerfile` (Nginx serving `/usr/share/nginx/html`).
4. `nginx`: reverse proxy listening on 80 (and 443 when certificate available). Routes `/api` -> backend, `/` -> web. Optionally serve miniapp QR codes/static.
5. `scheduler` (optional): separate container running same backend image but with profile `scheduler` to isolate cron jobs.

Networks: default bridge `petcare-net`.
Volumes: `mysql-data`, `backend-logs`.

## Environments
- **Local Dev**: Developers run Docker Compose or `npm start` + `./gradlew bootRun` with local MySQL.
- **Staging/Prod**: Single EC2 instance (Ubuntu 24.04) running `docker compose up -d`. Managed via SSH + `docker compose pull && up -d`. Use systemd service to auto-start compose on boot.

## Secrets Management
- `.env` file (not committed) holds secrets: DB creds, OpenAI key, WeChat keys, JWT signing secret.
- Provide `infra/env.example` as template (placeholders only).
- On EC2, store secrets in `/opt/petcare/.env` with 600 perms. Compose references `env_file`.

## Logging & Monitoring
- Backend logs to stdout (JSON), aggregated via Docker logging driver (json-file). Future: plug into CloudWatch/ELK.
- MySQL slow query log optional.
- Health endpoint `/actuator/health` exposed internally; Nginx upstream health checks.
- Simple uptime check via cron + `curl` hitting `/api/v1/health`.

## Backups & Data Safety
- Nightly `mysqldump` via cron container writing to `/backups` volume (retention 7 days). Optionally sync to S3 later.
- Photos stored as BLOB; consider periodic export for backup.

## Deployment Workflow
1. `git push origin main` triggers GitHub Actions (future) to run unit tests + build artifacts.
2. Manual release: SSH into EC2, `git pull` (or `docker pull` from GHCR if we push images) and `docker compose up -d --build`.
3. Provide `infra/scripts/deploy.sh` to automate.

## Environment Variables Summary
| Variable | Description |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | `prod`, `dev`, `scheduler`. |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | MySQL connection. |
| `JWT_SECRET`, `JWT_EXPIRY_MINUTES`, `REFRESH_EXPIRY_DAYS` | Auth tokens. |
| `OPENAI_API_KEY` | Provided key. |
| `WECHAT_APP_ID`, `WECHAT_APP_SECRET` | Mini program integration. |
| `REMINDER_LEAD_DAYS` | Default = 7. |
| `MAX_UPLOAD_SIZE_MB` | e.g., 8MB per photo. |

## Access Control & Approvals
- All production deployments require Andy’s explicit approval (per “设计到付款需确认”要求)。
- Any change that incurs external cost (OpenAI usage, storage) must be pre-approved.

## Future Enhancements
- Introduce GitHub Actions CI/CD with build caching.
- Container registry (GitHub Packages) for backend/web images.
- Observability stack (Prometheus + Grafana).
- HTTPS via ACM/Let’s Encrypt once domain acquired.

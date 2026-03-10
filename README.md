# PetCareSystem

Design-in-progress for a pet health & caretaker platform (Angular + Spring Boot + MySQL + WeChat Mini Program + OpenAI). This repo currently contains design documentation while implementation is being planned.

## Current Deliverables
- `docs/system-architecture.md`
- `docs/api-spec.md`
- `docs/frontend-ia.md`
- `docs/devops-plan.md`
- `docs/runtime-comparison.md`
- `docs/roadmap.md`

## Local Dev & Deployment
The `infra/` directory now contains everything needed to stand up the stack with Docker Compose.

### Requirements
- Docker Engine 26+ and Docker Compose v2
- Node 20+ (for local Angular dev)
- JDK 21 (if building backend outside containers)

### One-command stack bring-up
```bash
cp infra/env.example infra/.env  # fill in secrets afterwards
./infra/scripts/deploy.sh        # builds images + docker compose up -d
```
The stack includes MySQL 8, Spring Boot API, scheduler worker, Angular static container, and an Nginx reverse proxy on port 80.

### Useful commands
```bash
# View logs
cd infra && docker compose logs -f backend

# Stop the stack
cd infra && docker compose down

# Remove volumes (⚠ wipes DB)
cd infra && docker compose down -v
```

Keep production secrets outside the repo (e.g., `/opt/petcare/.env` on the EC2 host) and pass them via `--env-file` when deploying.

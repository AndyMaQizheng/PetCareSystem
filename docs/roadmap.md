# Implementation Roadmap

| Phase | Description | Key Deliverables | Approval Needed |
| --- | --- | --- | --- |
| **0. Design Sign-off** | Finalize architecture, schemas, API spec, DevOps plan, runtime comparison. | Docs in `docs/` (architecture, API, IA, DevOps, runtime comparison, roadmap). | ✅ (current request) |
| **1. Repository Bootstrap** | Scaffold backend (Spring Boot Gradle project), Angular workspace, miniapp skeleton, infra directory. Configure lint/test tooling. | `backend/`, `web/`, `miniapp/`, `infra/` scaffolds, initial README. | Yes |
| **2. Backend Core** | Implement auth, pet CRUD, event logging, photo upload (BLOB), reminder & AI data models, Flyway migrations, OpenAPI config. | REST endpoints + unit tests, DB schema, integration tests for core flows. | Yes |
| **3. Frontend Web (Angular)** | Build authentication pages, dashboard, pet management, event forms, reminder center, AI insights UI, media uploader. | Angular modules/components, Material theming, API integration, e2e smoke tests. | Yes |
| **4. WeChat Mini Program** | Implement login (email/password + optional WeChat binding), pet list/detail, event logging, reminders, photo upload. | Miniapp pages, API wrappers, configuration (`project.config.json`). | Yes |
| **5. AI & Scheduler** | Implement scheduled jobs for weekly insights + vaccine reminders, OpenAI service integration, notification tables, admin controls. | Cron tasks, prompt templates, toggles, monitoring dashboards. | Yes (due to OpenAI usage cost). |
| **6. DevOps & Deployment** | Create Dockerfiles, Compose stack, env templates, deployment scripts, GitHub Actions (tests). Deploy to EC2 (with approval). | `infra/docker-compose.yml`, `.env` template, deploy docs, running stack on EC2. | Yes |
| **7. QA & Documentation** | Manual test plan, API documentation polishing, user guide, WeChat miniapp packaging instructions. | QA checklist, API docs published, README updates. | Yes |
| **8. Launch & Handover** | Final deployment, credentials handover, backup strategy confirmation, future enhancement backlog. | Running system, knowledge transfer notes. | Yes |

**Approvals**: Per instruction, each phase (especially those incurring costs) will pause for your confirmation before proceeding.

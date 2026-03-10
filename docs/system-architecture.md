# PetCareSystem – System Architecture

## Overview
PetCareSystem is a full-stack platform for pet caretakers (“铲屎官”) to manage pet profiles, health records, and reminders across web (Angular) and WeChat Mini Program clients. The backend is a Spring Boot service backed by MySQL (running in Docker) and integrates with OpenAI for weekly insights plus WeChat APIs for mini-program login. Deployment targets a single EC2 instance orchestrated via Docker Compose.

```
[Angular Web App] ─┐
                   │        ┌──────────┐        ┌─────────────┐
[WeChat MiniApp] ──┼──────▶ │  API GW  │ ─────▶ │ Spring Boot │
                   │        └──────────┘        │  Services   │
[iOS/Android Web] ─┘                             └──────┬──────┘
                                                             │
                                      ┌──────────────────────┴───────────────┐
                                      │         MySQL (Docker)               │
                                      │  Users / Pets / Events / Photos /    │
                                      │  Reminders / AIInsights              │
                                      └──────────────────────────────────────┘
                                             │                     │
                  ┌───────────────────────────┘                     └───────────────────┐
                  │                                                                  │
          [OpenAI API]                                                      [WeChat API]
```

## Components

### Frontends
- **Angular + Material Web App**: Responsive dashboard for desktop/mobile browsers. Implements login/registration, pet CRUD, event logging UI, photo uploads, AI insights view, reminder center.
- **WeChat Mini Program**: Native experience sharing backend APIs. Implements login (username/password or optional WeChat login), simplified UI optimized for mobile. Uses `wx.uploadFile` for photos.

### Backend (Spring Boot)
Modular monolith with the following packages:

| Module | Responsibilities |
| --- | --- |
| `auth-service` | User registration, JWT issuance, password hashing, session refresh, optional WeChat login binding (`jscode2session`). |
| `pet-service` | Pet profiles CRUD, metadata validation, linking caretakers to pets. |
| `event-service` | Record pet events (排泄/饮食/疫苗/生病/自定义), enforce enums, aggregate stats. |
| `media-service` | Manage photo upload/download APIs, store binary payloads in MySQL BLOB columns with metadata (MIME type, size). |
| `notification-service` | Reminder scheduling (vaccines, tasks), push to notification table (in-app) for Angular/MiniApp to poll. |
| `ai-insights-service` | Weekly cron job to summarize past events and call OpenAI APIs for suggestions, persist `ai_insights` entries. |
| `wechat-service` | Wraps WeChat AppID/AppSecret flows (login, optional template messages). |

Cross-cutting concerns: validation, auditing, error handling, logging, DTO mappers, OpenAPI docs.

### Data Storage (MySQL)
Tables (initial set):
- `users` – caretakers/admins, salted password hash, roles, contact info.
- `pets` – pet profile details (species, breed, DOB, vaccinations schedule, avatar BLOB ref).
- `pet_events` – events per pet with type (`ELIMINATION`, `MEAL`, `VACCINE`, `ILLNESS`, `NOTE`...), timestamps, quantitative fields.
- `pet_photos` – BLOB storage for uploaded images; includes `pet_id`, `uploader_id`, `content_type`, `data LONGBLOB` and checksum for dedupe.
- `reminders` – vaccine reminder instances with due date, status, ack timestamp.
- `ai_insights` – weekly suggestions per pet (text, JSON metadata, OpenAI request/response IDs).
- `wechat_links` – optional table linking `user_id` with `openid`/`session_key` when WeChat login is enabled.

Schema managed via Flyway to keep containerized MySQL consistent.

### Scheduled Jobs
- **Weekly Insight Job**: Every Sunday 02:00 (configurable). Aggregates prior week’s events per pet, builds prompt, calls OpenAI (via `OPENAI_API_KEY`), stores summary + action items in `ai_insights`, flags unread items for caretakers.
- **Vaccine Reminder Job**: Daily 00:00. Scans pets with upcoming vaccine events within 7 days; inserts reminder rows and marks when acknowledged. Future extension hooks email/SMS providers.

### Integrations
- **OpenAI**: Backend holds `OPENAI_API_KEY`. HTTP client with retry/backoff, model (e.g., `gpt-4.1-mini`). Optionally override per environment variable.
- **WeChat Mini Program**: Provide `/auth/wechat/login` endpoint calling `https://api.weixin.qq.com/sns/jscode2session` using `WECHAT_APP_ID` & `WECHAT_APP_SECRET` to exchange `code` for `openid/session_key`, then bind to internal user or create new account.

### Deployment Topology (Docker Compose)
Containers:
1. `api` – Spring Boot app (openjdk base image), exposes port 8080 behind Nginx.
2. `web` – Angular build served via Nginx (static).
3. `mysql` – Official MySQL 8 image with mounted volume for data.
4. `jobs` (optional) – same image as `api`, but running scheduled tasks if separation desired; or run inside main app.
5. `minio` or `localstack` not required because photos in DB (but consider future move).
6. `nginx` – Reverse proxy for API + web assets, TLS-ready (even if using IP only for now).

Environment configuration via `.env` (OpenAI key, DB creds, WeChat secrets). Compose file defines networks + volumes.

### Security Considerations
- JWT-based auth for APIs; refresh tokens stored server-side (Redis optional later).
- Input validation & size limits on photo uploads to protect DB.
- Secrets injected through env vars / Docker secrets; not committed to repo.
- Role-based access: at launch only caretaker-admin role; ready for multi-role extension.

## Key Flows

### Login/Registration
1. User registers via email/phone + password (hashed with bcrypt/scrypt).
2. Login returns JWT + refresh token. Mini program can use username/password or `wx.login` -> `jscode2session` -> backend verifies & issues JWT.

### Pet Event Recording
1. Frontend hits `/api/pets/{id}/events` with event payload.
2. Backend validates type-specific fields, stores row + optional `pet_photos` entries if photo included.
3. Push event to cache for analytics (future) and mark for weekly insight aggregator.

### Weekly AI Suggestion
1. Cron job loads last 7 days per pet, builds prompt summarizing notable events.
2. Calls OpenAI chat/completions API.
3. Stores response in `ai_insights`, surfaces to clients via `/api/pets/{id}/insights/latest`.

### Vaccine Reminder
1. Cron job checks `vaccine_schedule` entries with due date within 7 days.
2. For each, insert `reminders` row (type `VACCINE`) with due date & message.
3. Clients poll `/api/reminders` or receive push once push channels exist.

---
This document will evolve as we flesh out the schema and API spec.

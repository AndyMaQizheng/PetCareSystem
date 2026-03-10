# PetCareSystem – API Specification (Draft)

This document outlines the initial REST API surface that will be formalized in OpenAPI 3.0 once schemas are stable.

Base URL: `/api/v1`
Authentication: JWT Bearer tokens unless stated otherwise.

## Auth

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Create caretaker admin account. |
| `POST` | `/auth/login` | Username/password login; returns JWT + refresh token. |
| `POST` | `/auth/refresh` | Exchange refresh token for new JWT. |
| `POST` | `/auth/logout` | Invalidate refresh token. |
| `POST` | `/auth/wechat/login` | (Mini program) Exchange WeChat `code` for `openid`, bind to user, issue JWT. |

### Sample: `POST /auth/register`
```json
{
  "email": "andy@example.com",
  "phone": "+1-240-555-0101",
  "password": "P@ssw0rd!",
  "fullName": "Andy Ma"
}
```
Response `201 Created`:
```json
{
  "id": "usr_01",
  "email": "andy@example.com",
  "fullName": "Andy Ma",
  "role": "ADMIN"
}
```

## Users / Profile
- `GET /users/me` – fetch profile & linked WeChat info.
- `PATCH /users/me` – update profile fields (phone, locale, notification prefs, reminder lead days) .
- `POST /users/me/wechat/unlink` – detach WeChat openid if needed.

## Pets

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/pets` | List pets owned by caretaker. Supports pagination/filter. |
| `POST` | `/pets` | Create pet profile. |
| `GET` | `/pets/{petId}` | Fetch pet details + latest stats. |
| `PATCH` | `/pets/{petId}` | Update pet info. |
| `DELETE` | `/pets/{petId}` | Soft-delete pet (archived). |

### Pet Payload
```json
{
  "name": "Lucky",
  "species": "Dog",
  "breed": "Shiba Inu",
  "gender": "MALE",
  "birthDate": "2022-08-12",
  "weightKg": 12.4,
  "vaccinationPlan": [
    { "name": "Rabies", "scheduledDate": "2025-01-10" },
    { "name": "DHPP", "scheduledDate": "2025-03-05" }
  ]
}
```

## Pet Events

Events cover 排泄/饮食/疫苗/生病/其他。 Store as `pet_events` with typed payload.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/pets/{petId}/events` | List events with filters (`type`, `from`, `to`). |
| `POST` | `/pets/{petId}/events` | Create event with optional photos. |
| `GET` | `/pets/{petId}/events/{eventId}` | Event detail. |
| `PATCH` | `/pets/{petId}/events/{eventId}` | Update event notes/values. |
| `DELETE` | `/pets/{petId}/events/{eventId}` | Remove event (soft delete). |

Sample `POST` payload:
```json
{
  "type": "MEAL",
  "occurredAt": "2026-03-09T08:30:00Z",
  "quantity": {
    "unit": "g",
    "value": 150
  },
  "notes": "Ate breakfast kibble",
  "symptoms": [],
  "attachments": ["tempPhotoId1"]
}
```
Attachments reference temporary upload tokens; actual binary uploaded via `/media/uploads`.

## Media Uploads

1. Client calls `POST /media/uploads` with metadata to receive pre-upload token (or direct multipart upload).
2. Upload binary via `POST /media/uploads/{uploadId}` (multipart/form-data) or direct streaming.
3. Backend validates content type, size, stores in `pet_photos` once event references it.

Endpoints:
- `POST /media/uploads` – create upload session (returns `uploadId`, pre-signed URL if future switch to object storage).
- `POST /media/uploads/{uploadId}` – upload binary.
- `GET /media/photos/{photoId}` – fetch (with size bounds and auth).

## AI Insights

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/pets/{petId}/insights` | Paginated list of AI suggestions. |
| `GET` | `/pets/{petId}/insights/latest` | Latest insight summary. |
| `POST` | `/pets/{petId}/insights/refresh` | (Admin) Manually trigger new suggestion. |
| `PATCH` | `/pets/{petId}/insights/{insightId}` | Mark as read / add caretaker feedback. |

Insight representation:
```json
{
  "id": "ai_20260310_001",
  "petId": "pet_01",
  "weekOf": "2026-03-09",
  "summary": "Lucky had reduced appetite mid-week...",
  "recommendations": [
    {
      "priority": "HIGH",
      "text": "Monitor stool consistency for 48h",
      "tags": ["DIET", "MONITOR"]
    }
  ],
  "model": "gpt-4.1-mini",
  "unread": true
}
```

## Reminders

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/reminders` | List pending reminders (supports `status`, `type`). |
| `PATCH` | `/reminders/{reminderId}` | Mark as acknowledged/dismissed. |
| `POST` | `/reminders/test` | (Admin) Trigger test reminder (for QA). |

Reminder payload example:
```json
{
  "id": "rem_20260315_01",
  "petId": "pet_01",
  "type": "VACCINE",
  "title": "Rabies booster due in 7 days",
  "dueDate": "2026-03-22",
  "status": "PENDING"
}
```

## Analytics & Dashboard (optional stretch)
- `GET /dashboard/overview` – aggregated KPIs (events per type, compliance rate, pending vaccines).
- `GET /pets/{petId}/stats` – computed metrics per pet.

## Error Handling
- Standardized error envelope:
```json
{
  "timestamp": "2026-03-10T04:00:00Z",
  "status": 400,
  "error": "INVALID_EVENT",
  "message": "quantity.value must be positive",
  "traceId": "req-abc123"
}
```
- Use RFC7807 Problem Details for extensibility.

## Authentication Notes
- JWT expiry 15 min; refresh token 30 days stored server-side with device info.
- Mini program login: `POST /auth/wechat/login` body `{ "code": "wxLoginCode", "nickname": "..", "avatarUrl": ".." }`. Backend exchanges `code` for `openid`, links to user, returns JWT.

This draft will be converted to `openapi.yaml` once review completes.

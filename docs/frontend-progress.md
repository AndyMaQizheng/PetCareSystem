# Frontend Implementation Tracker

Use this checklist to monitor Angular Web App progress before we advance to backend/database integration (Phase 2) and the WeChat mini program.

## Global
- [x] Shell layout (sidenav, responsive breakpoints, theming)
- [ ] Auth guard + route protection

## Auth
- [x] Login page (email/phone + password)
- [x] Registration page + validation
- [ ] Session management (JWT interceptor stub)

## Dashboard
- [x] KPIs & cards (宠物/提醒/事件/AI) + 路由联动
- [ ] Activity feed component

## Pets Module
- [x] `/pets` list view骨架（静态数据）
- [x] Create pet wizard (`/pets/new`) + PrimeNG 验证/Toast
- [x] Pet detail tabs雏形（概览/动态/AI 标记）
- [ ] Event log modal + type-specific forms

## Media & Insights
- [ ] Photo gallery + uploader widget
- [ ] Insights list & detail view

## Reminders
- [x] Reminder center list + mark-as-done交互雏形

## Settings
- [x] Profile edit page (静态占位)
- [x] Notification preferences
- [x] WeChat binding UI placeholder

## Infrastructure / DX
- [x] Angular app scaffolded (`web/`)
- [x] Dockerized static build served through Nginx (deployed via Compose)
- [ ] Storybook or component playground (optional)
- [ ] E2E smoke tests (Cypress/Playwright)

_Status legend: unchecked = not started/in progress, checked = done._

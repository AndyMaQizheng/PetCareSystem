# Frontend Implementation Tracker

Use this checklist to monitor Angular Web App progress before we advance to backend/database integration (Phase 2) and the WeChat mini program.

## Global
- [ ] Shell layout (sidenav, responsive breakpoints, theming)
- [ ] Auth guard + route protection

## Auth
- [ ] Login page (email/phone + password)
- [ ] Registration page + validation
- [ ] Session management (JWT interceptor stub)

## Dashboard
- [ ] KPIs & cards (pets summary, latest insights, reminders)
- [ ] Activity feed component

## Pets Module
- [ ] `/pets` list view with filters/search
- [ ] Create pet wizard (`/pets/new`)
- [ ] Pet detail tabs (Overview / Timeline / Photos / Insights / Settings)
- [ ] Event log modal + type-specific forms

## Media & Insights
- [ ] Photo gallery + uploader widget
- [ ] Insights list & detail view

## Reminders
- [ ] Reminder center list + mark-as-done interactions

## Settings
- [ ] Profile edit page (contact info, locale)
- [ ] Notification preferences
- [ ] WeChat binding UI placeholder

## Infrastructure / DX
- [x] Angular app scaffolded (`web/`)
- [x] Dockerized static build served through Nginx (deployed via Compose)
- [ ] Storybook or component playground (optional)
- [ ] E2E smoke tests (Cypress/Playwright)

_Status legend: unchecked = not started/in progress, checked = done._

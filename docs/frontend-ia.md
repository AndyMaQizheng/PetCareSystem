# Frontend & Mini Program Information Architecture (Draft)

## Angular Web App

### Layout
- **Shell**: Angular Material `MatSidenav` layout with persistent left nav on desktop, bottom nav on mobile widths.
- **Global elements**: App bar (logo, notification bell, profile menu), breadcrumbs, toast service.

### Routes / Pages
| Route | Description |
| --- | --- |
| `/login` | Email/phone login (JWT). Separate register link. |
| `/register` | Account creation. |
| `/dashboard` | Overview cards: pets summary, upcoming vaccines, latest AI insight snippets, activity feed. |
| `/pets` | List of pets with filters. |
| `/pets/new` | Wizard to add pet (basic info, vaccines). |
| `/pets/:id` | Tabs: Overview, Timeline, Photos, Insights, Settings. |
| `/pets/:id/events/new` | Modal/wizard to log event (type-specific forms). |
| `/insights` | Aggregated AI insights across pets. |
| `/reminders` | Reminder center (list, mark done). |
| `/settings/profile` | Profile, password, notification prefs. |
| `/settings/integrations` | WeChat binding, API tokens (future). |

### Components
- Pet card, event timeline, event form (dynamic), photo gallery (grid + lightbox), AI insight card, reminder list item, upload widget (drag/drop or file input), WeChat binding status.

### State Management
- NgRx or Signals-based store (per feature) storing pets, events, reminders, session tokens.
- HTTP interceptors for JWT, loading indicators, error handling.

### Responsive Strategy
- Material breakpoints; mobile uses bottom sheet for event creation, simplified cards, infinite scroll lists.

## WeChat Mini Program

### Tech stack
- Use原生小程序 + TypeScript + WXML/WXSS. Folder `miniapp/` inside repo with standard `app.js`, `app.json`, `project.config.json`.
- UI library: WeUI / NutUI for consistent components.

### Pages
| Page | Path | Notes |
| --- | --- | --- |
| 登录 | `/pages/login/index` | Username/password + optional “使用微信授权登录”按钮。 |
| 首页 | `/pages/home/index` | Quick stats, upcoming reminders, shortcuts。 |
| 宠物列表 | `/pages/pets/list` | Cards + add button。 |
| 宠物详情 | `/pages/pets/detail?id=PET_ID` | Tabs (概览、记录、照片、建议)。 |
| 新增记录 | `/pages/events/new?petId=` | Step form by type。 |
| 照片上传 | `/pages/photos/upload` | Uses `wx.chooseMedia` + `wx.uploadFile` to backend. |
| 提醒中心 | `/pages/reminders/index` | List & mark done。 |
| 设置 | `/pages/settings/index` | Profile, WeChat绑定状态, 退出登录。 |

### Login Flow
1. 用户可直接输入账号/密码（与 Web 相同），后台返回 JWT。
2. 或点击「微信授权」，调用 `wx.login` 获取 code，发给 `/auth/wechat/login`。
3. 后端通过 `WECHAT_APP_ID/SECRET` 调 `jscode2session`，获取 `openid`，若已绑定则返回 JWT，未绑定则要求补充手机号/密码后创建账号。
4. JWT 存储在小程序 `storage`，在 `wx.request` header 携带 `Authorization`。

### Photo Upload
- 选媒体 -> 预览 -> 上传：`wx.uploadFile` -> `/media/uploads/{uploadId}` (multipart)。
- 上传前先调用 `/media/uploads` 获取 `uploadId`。

### Reminders & Insights
- 首页展示 Top 2 reminders + latest insight card。
- Reminders页面可下拉刷新、左滑标记完成。

### Offline / Error Handling
- 网络错误统一 toast +重试。JWT 过期跳转登录页。

## Shared UX Principles
- 数据同步：所有写操作完成后刷新相关 store（web) / 本地缓存（小程序）。
- 输入验证：类型化表单（数量、体温等），必要时 double confirmation（删除宠物）。
- 多语言：初期中文 UI，备用 i18n slots 以备英文。

## Assets & Branding
- 暂无品牌颜色 => 先用 Material 调色板（Primary：teal，Accent：amber）。
- 图标：Material Icons + 微信内置 iconfont。

---
This IA will be refined during UI wireframing. Comments welcome before we start component scaffolding.

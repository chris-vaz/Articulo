<div align="center">

<img src="./articulo/public/brand/logo.svg" alt="Articulo logo" width="88" height="88" />

# Articulo

### Automate your work across every app

Visual, no-code workflows that connect **Google Drive, Slack, Notion and Discord**.<br/>
Set it up once and let it run.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com)
[![Stripe](https://img.shields.io/badge/Billing-Stripe-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Quick start](#-quick-start) · [Features](#-features) · [Screenshots](#-screenshots) · [Pricing](#-pricing) · [Setup guide](./articulo/SETUP.md)

<br/>

<img src="./articulo/public/screenshots/landing.webp" alt="Articulo landing page" width="100%" />

</div>

---

## ✨ Features

| | |
| --- | --- |
| 🧩 **Visual workflow builder** | Drag triggers and actions onto an infinite canvas and connect them. No code, no YAML. |
| ⚡ **Real-time triggers** | Workflows start the moment files change in Google Drive. Or press **Run now** to start one by hand. |
| 🔌 **Native integrations** | Slack, Notion, Discord and Google Drive over secure OAuth. Tokens never leave the server. |
| 📜 **Step-by-step logs** | Every run is recorded with the result of each step, so failures are easy to find and fix. |
| 📊 **Usage dashboard** | Runs, success rate and remaining credits at a glance, plus a getting-started checklist for new users. |
| 💳 **Subscriptions built in** | Stripe Checkout, customer portal and usage-based run credits per plan. |
| 🌗 **Dark and light themes** | Fully responsive, with mobile navigation, loading skeletons and accessible components. |
| 🛡️ **Multi-tenant by design** | Every query is scoped to the signed-in user, webhooks are signature-verified, and the app ships with security headers. |

## 📸 Screenshots

<table>
  <tr>
    <td width="50%"><img src="./articulo/public/screenshots/dashboard.webp" alt="Dashboard" /><p align="center"><b>Dashboard</b>: runs, success rate and credits</p></td>
    <td width="50%"><img src="./articulo/public/screenshots/editor.webp" alt="Workflow editor" /><p align="center"><b>Workflow editor</b>: drag, connect, publish</p></td>
  </tr>
  <tr>
    <td><img src="./articulo/public/screenshots/workflows.webp" alt="Workflows" /><p align="center"><b>Workflows</b>: toggle automations live</p></td>
    <td><img src="./articulo/public/screenshots/logs.webp" alt="Execution logs" /><p align="center"><b>Logs</b>: every step of every run</p></td>
  </tr>
  <tr>
    <td><img src="./articulo/public/screenshots/connections.webp" alt="Connections" /><p align="center"><b>Connections</b>: one-click OAuth</p></td>
    <td><img src="./articulo/public/screenshots/billing.webp" alt="Billing" /><p align="center"><b>Billing</b>: Stripe subscriptions</p></td>
  </tr>
  <tr>
    <td><img src="./articulo/public/screenshots/templates.webp" alt="Templates" /><p align="center"><b>Templates</b>: start from a proven flow</p></td>
    <td><img src="./articulo/public/screenshots/dashboard-light.webp" alt="Light theme" /><p align="center"><b>Light theme</b></p></td>
  </tr>
</table>

<p align="center">
  <img src="./articulo/public/screenshots/mobile-dashboard.webp" alt="Mobile dashboard" width="260" />
  &nbsp;&nbsp;
  <img src="./articulo/public/screenshots/mobile-workflows.webp" alt="Mobile workflows" width="260" />
</p>

## 💰 Pricing

Plans are configured in [`src/lib/plans.ts`](./articulo/src/lib/plans.ts) and billed through Stripe.

| | **Starter** | **Pro** | **Unlimited** |
| --- | :---: | :---: | :---: |
| Price | $0 / month | $29 / month | $99 / month |
| Workflow runs | 10 / month | 1,000 / month | Unlimited |
| All integrations | ✓ | ✓ | ✓ |
| Execution logs | ✓ | ✓ | ✓ |
| Priority support | | ✓ | ✓ |

## 🚀 Quick start

You don't need a `.env` file to try Articulo locally. Login runs in Clerk's keyless dev mode, and the database runs locally.

```bash
cd articulo
npm install
npm run setup   # starts a local Postgres and applies migrations
npm run dev     # → http://localhost:3000
```

Requires **Node.js 20.9+**. Run `npm run check-env` to see which integrations are enabled.
The [setup guide](./articulo/SETUP.md) covers each API key, Stripe billing, deployment to Vercel and a launch checklist.

## 🏗️ How it works

```mermaid
flowchart LR
    A[Google Drive change] -->|push notification| B[/api/drive-activity/notification/]
    M[Run now button] --> C
    B --> C{Workflow runner}
    C -->|1 credit per run| D[(Postgres)]
    C --> E[Slack]
    C --> F[Notion]
    C --> G[Discord]
    C -->|step results| H[Execution logs]
    S[Stripe webhook] -->|plan & credits| D
```

## 🛠️ Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 with the React Compiler |
| Language | TypeScript |
| Auth | Clerk |
| Database | PostgreSQL (Neon, Supabase or local) with Prisma 7 |
| Payments | Stripe Checkout and Customer Portal |
| UI | Tailwind CSS, shadcn/ui, Radix, lucide icons |
| Editor | React Flow, Zustand |
| Integrations | Google Drive API, Slack Web API, Notion API, Discord webhooks |

## 🗺️ Roadmap

- [ ] More actions: email, AI summaries, custom webhooks, Google Calendar
- [ ] Conditional branches and scheduled (cron) triggers
- [ ] Team workspaces and shared workflows
- [ ] Usage analytics charts and run-history export

---

<div align="center">
  <img src="./articulo/public/brand/logo.svg" alt="" width="28" height="28" /><br/>
  <sub><b>Articulo</b>: the connecting point between your apps.</sub>
</div>

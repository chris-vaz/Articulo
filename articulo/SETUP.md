# Articulo setup guide

This guide covers running Articulo locally (no `.env` needed), filling in the `.env` file feature by feature, and launching it as a paid SaaS.

---

## 1. Run it locally with zero configuration

Requirements: **Node.js 20.9 or newer** (`node -v`).

```bash
cd articulo
npm install
npm run setup   # starts a local Postgres database and applies migrations
npm run dev     # http://localhost:3000
```

What happens without any keys:

| Feature | Without keys |
| --- | --- |
| Login | Works. Clerk runs in **keyless mode** with temporary dev keys (stored in `.clerk/`, git-ignored). |
| Database | Works. `npm run setup` starts a local Postgres (Prisma Dev) and writes its `DATABASE_URL` into `.env`. |
| Workflows, editor, logs, dashboard | Work. |
| Slack / Notion / Discord / Google Drive | Show **Not configured** until you add their keys. |
| Billing upgrades | Disabled with a notice until Stripe keys are added. |
| Profile picture upload | Disabled until the Uploadcare key is added. |

Useful commands:

| Command | What it does |
| --- | --- |
| `npm run check-env` | Shows which features are enabled by your current `.env`. |
| `npm run db:dev` / `npm run db:stop` | Start/stop the local database (it keeps running in the background). |
| `npm run db:migrate` | Create a new migration after editing `prisma/schema.prisma`. |
| `npm run db:studio` | Browse the database in your browser. |
| `npm run typecheck` | TypeScript check. |

> After a reboot, run `npm run db:dev` (or `npm run setup` again) before `npm run dev`.

---

## 2. Filling in `.env`

Copy the template, then add sections one at a time. Restart `npm run dev` after editing `.env`.

```bash
cp .env.example .env    # keep the DATABASE_URL line that `npm run setup` wrote
```

### Auth: Clerk (required for production)
1. Create an application at <https://dashboard.clerk.com>. If you've been using keyless mode, click **Configure your application** in the bottom-right popup to *claim* the temporary app instead. Your test users carry over.
2. Copy **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and **Secret key** → `CLERK_SECRET_KEY`.
3. Optional but recommended: **Webhooks → Add endpoint** `https://<your-domain>/api/clerk-webhook`, events `user.created`, `user.updated`, `user.deleted`. Put the signing secret in `CLERK_WEBHOOK_SIGNING_SECRET`. (Users are also created automatically on their first visit, so this is only needed to keep emails/names in sync and to delete data when a user deletes their account.)

### Database: Postgres (required for production)
Any Postgres works. [Neon](https://neon.tech) and [Supabase](https://supabase.com) have free tiers. Put the connection string in `DATABASE_URL`, then run `npm run db:deploy` to create the tables.

### Google Drive trigger
1. Google Cloud Console → create a project → enable the **Google Drive API**.
2. **APIs & Services → Credentials → OAuth client ID** (Web application). Copy the ID/secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
3. In Clerk: **SSO connections → Google → Use custom credentials**, paste the same ID/secret, and add the scope `https://www.googleapis.com/auth/drive`. Add Clerk's redirect URI (shown in Clerk) to the Google OAuth client.
4. Set `GOOGLE_DRIVE_WEBHOOK_SECRET` to any random string.
5. Google must be able to reach your app over HTTPS. Locally, run `ngrok http 3000` and put the https URL in `NGROK_URI`. In production, leave `NGROK_URI` empty.

### Discord
<https://discord.com/developers/applications> → New Application → **OAuth2**:
- Copy Client ID/Secret into `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET`.
- Add redirect: `http://localhost:3000/api/auth/callback/discord` (and your production URL later).

### Notion
<https://www.notion.so/my-integrations> → New integration → type **Public**:
- Redirect URI: `http://localhost:3000/api/auth/callback/notion`
- Copy OAuth client ID → `NOTION_CLIENT_ID`, OAuth client secret → `NOTION_API_SECRET`.
- When connecting, users must share at least one **database** with Articulo; pages are created there.

### Slack
<https://api.slack.com/apps> → Create New App → **OAuth & Permissions**:
- Bot and user scopes: `chat:write`, `channels:read`, `groups:read`, `mpim:read`, `im:read`.
- Redirect URL: Slack **requires HTTPS**, so locally use your ngrok URL: `https://<id>.ngrok-free.app/api/auth/callback/slack`, and set `SLACK_REDIRECT_URI` to the same value.
- **Basic Information** → copy Client ID/Secret into `SLACK_CLIENT_ID` / `SLACK_CLIENT_SECRET`.
- Users must invite the bot to a channel (`/invite @YourApp`) before it appears in Articulo.

### Stripe billing
1. <https://dashboard.stripe.com> → **Products**: create **Pro** ($29/month) and **Unlimited** ($99/month) recurring prices. Copy the **price IDs** (`price_...`) into `STRIPE_PRICE_PRO` and `STRIPE_PRICE_UNLIMITED`.
2. **Developers → API keys** → secret key → `STRIPE_SECRET_KEY`.
3. **Developers → Webhooks → Add endpoint** `https://<your-domain>/api/stripe/webhook` with events `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`. Copy the signing secret → `STRIPE_WEBHOOK_SECRET`.
   Locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook` prints a secret to use instead.
4. **Settings → Billing → Customer portal**: enable it so users can manage/cancel subscriptions.

Plans, prices shown in the UI and run allowances live in `src/lib/plans.ts`.

### Uploadcare (profile pictures)
<https://app.uploadcare.com> → API keys → public key → `NEXT_PUBLIC_UPLOADCARE_PUB_KEY`.

---

## 3. Deploying (Vercel recommended)

1. Push the repo to GitHub and import it in Vercel. Set **Root Directory** to `articulo`.
2. Add every variable from your `.env` to the Vercel project (use **production** Clerk/Stripe keys, a hosted `DATABASE_URL`, and `NEXT_PUBLIC_URL=https://your-domain.com`).
3. Run migrations against the production database once: `DATABASE_URL=... npm run db:deploy`.
4. Update every OAuth redirect URI and webhook URL (Clerk, Google, Discord, Notion, Slack, Stripe) to your production domain.
5. Check `https://your-domain.com/api/health`. It reports database status and which integrations are configured.

---

## 4. Before you sell it: checklist

- [ ] Production Clerk instance, hosted Postgres, live Stripe keys.
- [ ] Terms of Service and Privacy Policy pages (you store users' OAuth tokens; Google requires a privacy policy for Drive access).
- [ ] **Google OAuth verification.** The Drive scope is "restricted": until Google verifies your app, only test users you add can connect Drive.
- [ ] Publish your Slack app and Notion public integration so any workspace can install them.
- [ ] Monthly credit reset for Free users (paid plans refill on each Stripe renewal). Add a scheduled job (e.g. Vercel Cron) that resets `credits` for `tier = 'Free'`.
- [ ] Error monitoring (e.g. Sentry) and uptime monitoring on `/api/health`.
- [ ] Encrypt stored OAuth tokens at rest (Slack/Notion/Discord tokens are currently stored as plain text in the database).
- [ ] **Licensing:** this project started from a public tutorial ("Fuzzie"). Check the original license before selling it commercially.

---

## 5. How it fits together

```
src/
  app/
    page.tsx                     Landing page (static)
    (auth)/                      Clerk sign-in / sign-up
    (main)/(pages)/              Dashboard, workflows, editor, templates, logs, connections, billing, settings
    api/auth/connect/[provider]  Starts Discord/Notion/Slack OAuth
    api/auth/callback/*          Finishes OAuth and saves the connection
    api/drive-activity/*         Google Drive watch + push notifications (the trigger)
    api/stripe/webhook           Plan changes and renewals
    api/clerk-webhook            User sync
    api/health                   Health check
  lib/
    env.ts                       Which features are configured
    auth.ts                      Current user + ownership checks
    plans.ts                     Pricing plans and run allowances
    workflow-runner.ts           Executes workflows step by step, logs results, charges credits
    integrations/                Slack, Notion, Discord, Google API calls (server-only)
  proxy.ts                       Route protection (Next.js middleware)
```

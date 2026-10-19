// Central place for reading environment configuration.
// Every integration is optional: when its keys are missing the app keeps
// running and the feature shows as "not configured" instead of crashing.

const has = (...keys: string[]) => keys.every((k) => !!process.env[k])

export const appUrl = () =>
  (process.env.NEXT_PUBLIC_URL || 'http://localhost:3000').replace(/\/$/, '')

// Public URL that external services (Google Drive push notifications) can reach.
// Locally this is your ngrok tunnel; in production it is just the app URL.
export const publicWebhookUrl = () =>
  (process.env.NGROK_URI || appUrl()).replace(/\/$/, '')

export const databaseUrl = () => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  throw new Error(
    'DATABASE_URL is not set. Run `npm run setup` to start a local database, or add your Postgres URL to .env.'
  )
}

export const features = {
  clerk: () => has('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'),
  clerkWebhook: () => has('CLERK_WEBHOOK_SIGNING_SECRET'),
  google: () => has('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'),
  discord: () => has('DISCORD_CLIENT_ID', 'DISCORD_CLIENT_SECRET'),
  notion: () => has('NOTION_CLIENT_ID', 'NOTION_API_SECRET'),
  slack: () => has('SLACK_CLIENT_ID', 'SLACK_CLIENT_SECRET'),
  uploadcare: () => has('NEXT_PUBLIC_UPLOADCARE_PUB_KEY'),
  stripe: () => has('STRIPE_SECRET_KEY'),
  stripeWebhook: () => has('STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'),
}

export type Feature = keyof typeof features

export const featureStatus = () =>
  Object.fromEntries(
    Object.entries(features).map(([name, check]) => [name, check()])
  ) as Record<Feature, boolean>

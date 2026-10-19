// Prints which features are enabled by the current .env. Run: npm run check-env
import 'dotenv/config'

const groups = [
  ['Database', ['DATABASE_URL'], 'run `npm run setup` to create a local database'],
  ['Auth (Clerk)', ['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'], 'Clerk keyless dev mode is used'],
  ['Clerk webhook', ['CLERK_WEBHOOK_SIGNING_SECRET'], 'users are still created on first visit'],
  ['Google Drive', ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'], 'Drive trigger disabled'],
  ['Discord', ['DISCORD_CLIENT_ID', 'DISCORD_CLIENT_SECRET'], 'Discord connection disabled'],
  ['Notion', ['NOTION_CLIENT_ID', 'NOTION_API_SECRET'], 'Notion connection disabled'],
  ['Slack', ['SLACK_CLIENT_ID', 'SLACK_CLIENT_SECRET'], 'Slack connection disabled'],
  ['Uploadcare', ['NEXT_PUBLIC_UPLOADCARE_PUB_KEY'], 'profile picture upload disabled'],
  ['Stripe', ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRICE_PRO', 'STRIPE_PRICE_UNLIMITED'], 'upgrades disabled'],
]

console.log('\nArticulo configuration\n')
for (const [name, keys, fallback] of groups) {
  const missing = keys.filter((k) => !process.env[k])
  const status = missing.length ? `✗  ${name.padEnd(16)} ${fallback} (missing: ${missing.join(', ')})` : `✓  ${name}`
  console.log(status)
}
console.log('\nSee SETUP.md for where to get each key.\n')

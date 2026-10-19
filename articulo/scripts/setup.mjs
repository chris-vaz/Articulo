// One-command local setup: npm run setup
// 1. Starts a local Postgres (Prisma Dev) in the background
// 2. Writes its DATABASE_URL into .env (only if you haven't set one yourself)
// 3. Applies all database migrations
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import 'dotenv/config'

const run = (cmd) =>
  execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, CHECKPOINT_DISABLE: '1' } })

let databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.log('▶ Starting local database (prisma dev)...')
  const output = run('npx prisma dev --name articulo-app --detach')
  const match = output.match(/postgres(?:ql)?:\/\/\S+/)
  if (!match) {
    console.error(output)
    throw new Error('Could not read the local database URL from `prisma dev`.')
  }
  databaseUrl = match[0]

  const env = existsSync('.env') ? readFileSync('.env', 'utf8') : ''
  const line = `DATABASE_URL="${databaseUrl}"`
  const next = /^DATABASE_URL=.*$/m.test(env)
    ? env.replace(/^DATABASE_URL=.*$/m, line)
    : `${env}${env && !env.endsWith('\n') ? '\n' : ''}# Local development database (written by npm run setup)\n${line}\n`
  writeFileSync('.env', next)
  console.log(`✓ Local database running. DATABASE_URL saved to .env`)
} else {
  console.log('✓ Using DATABASE_URL from your environment')
}

const migrateEnv = { ...process.env, DATABASE_URL: databaseUrl }
const deploy = () =>
  execSync('npx prisma migrate deploy', { encoding: 'utf8', stdio: 'pipe', env: migrateEnv })

console.log('▶ Applying database migrations...')
try {
  deploy()
} catch (error) {
  const text = `${error.stdout ?? ''}${error.stderr ?? ''}`
  // Database created earlier with `prisma db push`: mark the first migration as applied.
  if (!text.includes('P3005')) {
    console.error(text)
    process.exit(1)
  }
  execSync('npx prisma migrate resolve --applied 20260119121848_init', { stdio: 'pipe', env: migrateEnv })
  deploy()
}
console.log('✓ Database is up to date\n\nNext: npm run dev  →  http://localhost:3000\n')

import { db } from '@/lib/db'
import { featureStatus } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Uptime check: reports database reachability and which integrations are configured.
export async function GET() {
  let database = false
  try {
    await db.$queryRaw`SELECT 1`
    database = true
  } catch {}

  return Response.json(
    { ok: database, database, features: featureStatus() },
    { status: database ? 200 : 503 }
  )
}

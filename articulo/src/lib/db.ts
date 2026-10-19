import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { databaseUrl } from './env'

declare global {
  var prisma: PrismaClient | undefined
}

const createClient = () =>
  new PrismaClient({
    log: ['error'],
    // Prisma v7 requires a driver adapter. Neon / Supabase / local Postgres all speak pg.
    adapter: new PrismaPg({ connectionString: databaseUrl() }),
  })

export const db = globalThis.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}

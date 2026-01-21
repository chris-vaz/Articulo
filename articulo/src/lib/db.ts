import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global {
  var prisma: PrismaClient | undefined
}

export const db =
  globalThis.prisma ??
  new PrismaClient({
    log: ['error'],
    // Prisma v7 "client" engine requires a Driver Adapter (or Accelerate URL).
    // Neon is Postgres, so using the standard pg adapter is the simplest/most reliable setup.
    adapter: new PrismaPg(
      new Pool({
        connectionString: process.env.DATABASE_URL,
      })
    ),
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}

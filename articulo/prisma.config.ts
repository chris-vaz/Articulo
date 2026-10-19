import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Set in .env. `npm run setup` writes a local one for you.
    url: process.env['DATABASE_URL'],
  },
})

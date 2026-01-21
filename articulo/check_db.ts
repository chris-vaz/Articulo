
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Robust .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env')
        if (!fs.existsSync(envPath)) {
            console.log('.env file not found at:', envPath)
            return {}
        }
        const content = fs.readFileSync(envPath, 'utf-8')
        const env: Record<string, string> = {}
        content.split(/\r?\n/).forEach(line => {
            line = line.trim()
            if (!line || line.startsWith('#')) return
            const idx = line.indexOf('=')
            if (idx === -1) return

            const key = line.slice(0, idx).trim()
            let value = line.slice(idx + 1).trim()

            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1)
            }
            env[key] = value
        })
        return env
    } catch (e) {
        console.error('Error loading .env:', e)
        return {}
    }
}

const env = loadEnv()
console.log('Loaded keys:', Object.keys(env).join(', '))

if (env.DATABASE_URL) {
    process.env.DATABASE_URL = env.DATABASE_URL
    console.log('Set process.env.DATABASE_URL')
} else {
    console.log('DATABASE_URL not found in .env')
}

console.log('Raw DATABASE_URL from process.env:', JSON.stringify(process.env.DATABASE_URL))

// Standard PrismaClient using DATABASE_URL directly (binary engine forced via PRISMA_CLIENT_ENGINE_TYPE=binary)
const prisma = new PrismaClient({})

async function main() {
    try {
        console.log('Connecting to database...')
        const tableQuery = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
        const result = await prisma.$queryRawUnsafe(tableQuery)
        console.log('Connected! Found tables:', JSON.stringify(result, null, 2))

        // Check User count if User table exists
        const tables = result as any[]
        const hasUser = tables.some((t: any) => t.table_name === 'User')
        if (hasUser) {
            const userCount = await prisma.user.count()
            console.log('User count:', userCount)
        } else {
            console.log('User table not found.')
        }
    } catch (e) {
        console.error('Error connecting to database:', e)
        // Print checking logic
        console.log('Current DATABASE_URL env:', process.env.DATABASE_URL ? 'Defined (hidden)' : 'Undefined')
    } finally {
        await prisma.$disconnect()
    }
}

main()

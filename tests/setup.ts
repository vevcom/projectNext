import { afterAll, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'    
import { URL } from 'url'
import { v4 } from 'uuid'

// TODO: REFACTOR THIS MESS!

// We have to mock the server-only module because it thinks the test environment is running in the browser.
vi.mock('server-only', () => ({}))

vi.mock('next-auth', () => ({
    getServerSession: vi.fn(),
}))

// This mess is temporary!

function generateDatabaseURL(schemaName: string): string {
    if (!process.env.DB_URI) {
        throw new Error('Database URI not provided')
    }
    
    const url = new URL(process.env.DB_URI)
    url.searchParams.append('schema', schemaName)
    
    return url.toString()
}

// This mess is temporary!

const schemaName = `test-${v4()}`
 
const url = generateDatabaseURL(schemaName)

process.env.DB_URI = url

// This mess is temporary!

execSync('npx prisma db push --skip-generate', {
    env: {
      ...process.env,
      DB_URI: generateDatabaseURL(schemaName),
    },
})

const prisma = new PrismaClient({
    datasources: { db: { url } },
})

// This mess is temporary!

vi.mock('prisma', () => ({
    default: prisma,
}))

afterAll(async () => {
    await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
    )
})
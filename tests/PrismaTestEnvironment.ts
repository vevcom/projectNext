import { URL } from 'url'
import { v4 } from 'uuid'
import NodeEnvironment from 'jest-environment-node'
import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment'
import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

/**
 * Generates a modified version of the database URL environment variable 
 * `DB_URI` with the provided schema name.
 * 
 * @param schemaName The name of the schema to add to the database url.
 * @returns A modified version of `DB_URI` with the schema name.
 */
function generateDatabaseURL(schemaName: string): string {
    if (!process.env.DB_URI) {
        throw new Error('Database URI not provided')
    }
    
    const url = new URL(process.env.DB_URI)
    url.searchParams.append('schema', schemaName)
    
    return url.toString()
}

/**
 * A custom Jest environment that creates a new schema in the database for each test.
 */
export default class PrismaTestEnvironment extends NodeEnvironment {
    schema: string
    dbUrl: string

    constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
        super(config, context)

        // To avoid collision between concurrent tests each test will use its own 
        // postgresql schema. Here we generate a unique schema name and update 
        // the DB_URI environment variable for the tests.
        this.schema = `test-${v4()}`
        this.dbUrl = generateDatabaseURL(this.schema)
        this.global.process.env.DB_URI = this.dbUrl
    }

    async setup() {
        // Run migrations to create tables and columns in the new schema.
        execSync(`npx prisma db push --skip-generate`, { env: this.global.process.env })

        return super.setup()
    }

    async teardown() {
        // Delete the schema and all its tables after tests have run.
        const prisma = new PrismaClient({ datasourceUrl: this.dbUrl })
        await prisma.$executeRawUnsafe(`DROP SCHEMA "${this.schema}" CASCADE`)
        await prisma.$disconnect()
    }
}
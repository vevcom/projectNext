import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
    schema: './src/prisma/schema',
    datasource: {
        url: process.env.DB_URI,
    },
    migrations: {
        path: '', // TODO: Add migrations before production.
        seed: 'npx tsx src/prisma/seeder/seed.ts',
    }
})

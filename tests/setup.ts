import seed from '@/prisma/seeder/src/seeder'
import { beforeAll } from '@jest/globals'

beforeAll(
    async () => await seed(false, false, false),
    30 * 1000 // Timeout 30 seconds
)

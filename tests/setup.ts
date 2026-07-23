import seed from '@/prisma/seeder/src/seed'
import { beforeAll } from '@jest/globals'

const timeout = 30 * 1000

beforeAll(
    async () => await seed(false, false, false),
    timeout,
)

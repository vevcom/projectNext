import { prisma } from '@/prisma/client'
import { afterAll } from '@jest/globals'

afterAll(async () => {
    await prisma.$disconnect()
})

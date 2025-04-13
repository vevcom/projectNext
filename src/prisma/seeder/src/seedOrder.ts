import type { PrismaClient } from '@prisma/client'

export default async function seedOrder(prisma: PrismaClient) {
    await Promise.all(Array.from({ length: 106 }, (_, i) => i + 1).map(async (order) => {
        await prisma.omegaOrder.upsert({
            where: { order },
            update: {},
            create: { order },
        })
    }))
}

import type { PrismaClient } from '@prisma/client';

export default async function seedOrder(prisma: PrismaClient) {
    await prisma.omegaOrder.upsert({
        where: {
            order: 105
        },
        update: {

        },
        create: {
            order: 105,
        }
    })
}
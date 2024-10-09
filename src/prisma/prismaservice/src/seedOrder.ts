import type { PrismaClient } from '@/generated/pn'

export default async function seedOrder(prisma: PrismaClient) {
    await prisma.omegaOrder.upsert({
        where: {
            order: 106
        },
        update: {

        },
        create: {
            order: 106,
        }
    })
}

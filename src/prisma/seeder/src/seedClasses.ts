import type { PrismaClient } from '@prisma/client'

/**
 * Seeds classes and omega membership groups.
 * @param prisma - The prisma client
 */
export default async function seedClasses(prisma: PrismaClient) {
    const omegaOrder = await prisma.omegaOrder.findFirst()
    if (!omegaOrder) throw new Error('No omega order found')
    const order = omegaOrder.order

    await Promise.all([1, 2, 3, 4, 5, 6].map(i => prisma.class.create({
        data: {
            year: i,
            group: {
                create: {
                    groupType: 'CLASS',
                    order,
                },
            }
        }
    })))
}

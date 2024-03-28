import { OmegaMembershipLevel } from '@/generated/pn'
import type { PrismaClient } from '@/generated/pn'

/**
 * Seeds classes and omega membership groups.
 * @param prisma - The prisma client
 */
export default async function seedGroups(prisma: PrismaClient) {
    const omegaOrder = await prisma.omegaOrder.findFirst()
    if (!omegaOrder) throw new Error('No omega order found')
    const order = omegaOrder.order

    await Promise.all([0, 1, 2, 3, 4, 5, 6].map(i => prisma.class.create({
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

    for (const level of Object.values(OmegaMembershipLevel)) {
        await prisma.omegaMembershipGroup.create({
            data: {
                omegaMembershipLevel: level,
                group: {
                    create: {
                        groupType: 'OMEGA_MEMBERSHIP_GROUP',
                        order,
                    },
                }
            }
        })
    }
}

import type { PrismaClient } from '@/prisma-generated-pn-client'
import { OmegaMembershipLevel } from '@/prisma-generated-pn-types'

export default async function seedOmegaMembershipGroups(prisma: PrismaClient) {
    const levels = Object.values(OmegaMembershipLevel)

    await Promise.all(levels.map(level => prisma.omegaMembershipGroup.create({
        data: {
            omegaMembershipLevel: level,
            group: {
                create: {
                    groupType: 'OMEGA_MEMBERSHIP_GROUP',
                    order: 105
                }
            }
        }
    })))
}

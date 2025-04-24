import { OmegaMembershipLevel, type PrismaClient } from '@prisma/client'

export default async function seedOmegaMembershipGroups(prisma: PrismaClient) {
    const levels = Object.values(OmegaMembershipLevel)

    await Promise.all(levels.map(l => prisma.omegaMembershipGroup.create({
        data: {
            omegaMembershipLevel: l,
            group: {
                create: {
                    groupType: 'OMEGA_MEMBERSHIP_GROUP',
                    order: 105
                }
            }
        }
    })))
}

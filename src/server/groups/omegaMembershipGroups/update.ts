import 'server-only'
import { readOmegaMembershipGroup, readUserOmegaMembershipLevel } from './read'
import { OMEGA_MEMBERSHIP_LEVEL_RANKING } from '@/server/groups/ConfigVars'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import { readCurrentOmegaOrder } from '@/server/omegaOrder/read'
import { ServerError } from '@/server/error'
import type { OmegaMembershipLevel } from '@prisma/client'

function omegaMembershipGTEQ(lhs: OmegaMembershipLevel, rhs: OmegaMembershipLevel) {
    return OMEGA_MEMBERSHIP_LEVEL_RANKING.indexOf(lhs) >= OMEGA_MEMBERSHIP_LEVEL_RANKING.indexOf(rhs)
}

export async function updateUserOmegaMembershipGroup(
    userId: number,
    omegaMembershipLevel: OmegaMembershipLevel,
    onlyUpgrade = false
) {
    const group = await readOmegaMembershipGroup(omegaMembershipLevel)


    if (onlyUpgrade) {
        try {
            const currentMembership = await readUserOmegaMembershipLevel(userId)

            if (omegaMembershipGTEQ(currentMembership, omegaMembershipLevel)) {
                return
            }
        } catch (e) {
            if (!(e instanceof ServerError && e.errorCode === 'INVALID CONFIGURATION')) {
                throw e
            }
        }
    }

    const currentOmegaOrder = await readCurrentOmegaOrder()

    await prismaCall(() => prisma.$transaction([
        prisma.membership.deleteMany({
            where: {
                userId,
                group: {
                    groupType: 'OMEGA_MEMBERSHIP_GROUP',
                },
            }
        }),
        prisma.membership.create({
            data: {
                active: true,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                group: {
                    connect: {
                        id: group.groupId,
                    },
                },
                admin: false,
                omegaOrder: {
                    connect: {
                        order: currentOmegaOrder.order
                    },
                },
            }
        })
    ]))
}

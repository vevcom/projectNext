import 'server-only'
import prisma from '@/prisma'
import { OmegaMembershipLevel } from '@prisma/client'
import { readOmegaMembershipGroup, readUserOmegaMembershipLevel } from './read'
import { OMEGA_MEMBERSHIP_LEVEL_RANKING } from './ConfigVars'
import { prismaCall } from '@/server/prismaCall'
import { connect } from 'http2'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'

function omegaMembershipGTEQ(lhs: OmegaMembershipLevel, rhs: OmegaMembershipLevel) {
    return OMEGA_MEMBERSHIP_LEVEL_RANKING.indexOf(lhs) >= OMEGA_MEMBERSHIP_LEVEL_RANKING.indexOf(rhs)
}

export async function updateUserOmegaMembershipGroup(userId: number, omegaMembershipLevel: OmegaMembershipLevel, onlyUpgrade = false) {

    // Ensure the user is only in one omega memebrship group

    const group = await readOmegaMembershipGroup(omegaMembershipLevel)

    
    if (onlyUpgrade) {
        const currentMembership = await readUserOmegaMembershipLevel(userId)

        if (omegaMembershipGTEQ(currentMembership, omegaMembershipLevel)) {
            return;
        }
    }

    const currentOmegaOrder = await readCurrenOmegaOrder()

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
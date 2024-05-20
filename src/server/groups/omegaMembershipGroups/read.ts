import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { ServerError } from '@/server/error'
import type { OmegaMembershipLevel } from '@prisma/client'
import type { ExpandedOmegaMembershipGroup } from './Types'

export async function readOmegaMembershipGroups(): Promise<ExpandedOmegaMembershipGroup[]> {
    return await prismaCall(() => prisma.omegaMembershipGroup.findMany())
}

export async function readOmegaMembershipGroup(id: number | OmegaMembershipLevel): Promise<ExpandedOmegaMembershipGroup> {
    if (typeof id === 'number') {
        return await prismaCall(() => prisma.omegaMembershipGroup.findUniqueOrThrow({
            where: {
                id,
            },
        }))
    }

    return await prismaCall(() => prisma.omegaMembershipGroup.findUniqueOrThrow({
        where: {
            omegaMembershipLevel: id,
        },
    }))
}

export async function readUserOmegaMembershipLevel(userId: number): Promise<OmegaMembershipLevel> {
    const results = await prismaCall(() => prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
        select: {
            memberships: {
                select: {
                    group: {
                        select: {
                            omegaMembershipGroup: {
                                select: {
                                    omegaMembershipLevel: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    }))

    for (let i = 0; i < results.memberships.length; i++) {
        const g = results.memberships[i]
        const level = g.group.omegaMembershipGroup?.omegaMembershipLevel
        if (level) {
            return level
        }
    }

    throw new ServerError('INVALID CONFIGURATION', `The user with id ${userId} don't have any omega membership relation`)
}

import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import { ServerError } from '@/services/error'
import type { OmegaMembershipLevel } from '@prisma/client'
import type { ExpandedOmegaMembershipGroup } from './types'

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
    const omegaMembershipGroups = await prismaCall(() => prisma.omegaMembershipGroup.findMany({
        select: {
            groupId: true,
            omegaMembershipLevel: true,
        }
    }))

    const memberships = await prismaCall(() => prisma.membership.findMany({
        where: {
            userId,
            groupId: {
                in: omegaMembershipGroups.map(group => group.groupId),
            }
        }
    }))

    if (memberships.length !== 1) {
        throw new ServerError('INVALID CONFIGURATION', `The user with id ${userId} don't have any omega membership relation`)
    }

    for (let i = 0; i < omegaMembershipGroups.length; i++) {
        if (omegaMembershipGroups[i].groupId === memberships[0].groupId) {
            return omegaMembershipGroups[i].omegaMembershipLevel
        }
    }

    throw new ServerError('UNKNOWN ERROR', 'The user has a omega membership to a group that does not exist.')
}

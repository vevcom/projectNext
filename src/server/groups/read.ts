import { ServerError } from '@/server/error'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { Group, User } from '@prisma/client'
import type { BasicMembership, ExpandedGroup, ExpandedMembership } from './Types'
import { getActiveMembershipFilter } from '@/auth/getActiveMembershipFilter'
import { OmegaMembershipLevelConfig } from './ConfigVars'

export async function readGroups(): Promise<Group[]> {
    return await prismaCall(() => prisma.group.findMany())
}

export async function readGroup(id: number): Promise<Group> {
    return await prismaCall(() => prisma.group.findUniqueOrThrow({
        where: {
            id,
        },
    }))
}

export async function readGroupsExpanded(id: number): Promise<ExpandedGroup[]> {
    const groups = await prismaCall(() => prisma.group.findMany({
        include: {
            memberships: {
                take:  1,
                orderBy: {
                    order: 'asc'
                }
            },
            committee: { select: { name: true } },
            manualGroup: { select: { name: true } },
            class: { select: { year: true } },
            interestGroup: { select: { name: true } },
            omegaMembershipGroup: { select: { omegaMembershipLevel: true } },
            studyProgramme: { select: { name: true } },
        }
    }))

    return groups.map(group => {
        let name = `group id ${group.id}`
        switch (group.groupType) {
            case 'COMMITTEE':
                name = group.committee?.name ?? name
                break
            case 'MANUAL_GROUP':
                name = group.manualGroup?.name ?? name
                break
            case 'CLASS':
                name = `${group.class?.year ?? '??'}. Klasse`
                break
            case 'INTEREST_GROUP':
                name = group.interestGroup?.name ?? name
                break
            case 'OMEGA_MEMBERSHIP_GROUP':
                name = group.omegaMembershipGroup?.omegaMembershipLevel ?
                    OmegaMembershipLevelConfig[group.omegaMembershipGroup?.omegaMembershipLevel].name : 
                    name
                break
            case 'STUDY_PROGRAMME':
                name = group.studyProgramme?.name ?? name
                break
        }
        const firstOrder = group.memberships[0]?.order ?? group.order
        return {
            ...group,
            firstOrder,
            name,
        }
    })
}

export async function readMembershipsOfGroup(id: number): Promise<ExpandedMembership[]> {
    const count = await prismaCall(() => prisma.group.count({
        where: {
            id,
        },
    }))

    if (count !== 1) throw new ServerError('BAD PARAMETERS', 'Kan ikke lese medlemmer til en gruppe som ikke finnes.')


    return await prismaCall(() => prisma.membership.findMany({
        where: {
            groupId: id,
        },
    }))
}

export async function readMembershipsOfGroups(ids: number[]): Promise<ExpandedMembership[]> {
    return await prismaCall(() => prisma.membership.findMany({
        where: {
            groupId: {
                in: ids,
            },
        },
    }))
}

/**
 * Reads valid memberships of a user of a order
 * @param id - The id of the user
 * @param order - The order of what is considered valid membership. If undefined all memberships
 * are returned.
 * @returns 
 */
export async function readMembershipsOfUser(
    id: number,
    order?: number
): Promise<BasicMembership[]> {
    if (order === undefined) {
        order = (await readCurrenOmegaOrder()).order
    }

    return await prismaCall(() => prisma.membership.findMany({
        where: order ? {
            userId: id,
            ...getActiveMembershipFilter(order)
        } : { userId: id },
        select: {
            admin: true,
            groupId: true,
        }
    }))
}

export async function readUsersOfGroups(groups: { groupId: number, admin: boolean }[]): Promise<User[]> {
    return (await prismaCall(() => prisma.membership.findMany({
        where: {
            OR: groups.map(({ admin, groupId }) => ({
                admin: admin !== true ? undefined : true,
                groupId,
            })),
        },
        select: {
            user: true
        }
    }))).map(({ user }) => user)
}

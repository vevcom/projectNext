import { ServerError } from '@/server/error'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { Group, OmegaMembershipLevel, User } from '@prisma/client'
import type { ExpandedGroup, GroupsStructured } from './Types'
import type { ExpandedMembership, BasicMembership } from './memberships/Types'
import { getActiveMembershipFilter } from '@/auth/getActiveMembershipFilter'
import { GroupTypeOrdering, GroupTypesConfig, OmegaMembershipLevelConfig } from './ConfigVars'

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

export async function readGroupsExpanded(): Promise<ExpandedGroup[]> {
    const membershipFilter = getActiveMembershipFilter((await readCurrenOmegaOrder()).order)

    const groups = await prismaCall(() => prisma.group.findMany({
        include: {
            memberships: {
                take:  1,
                orderBy: {
                    order: 'asc'
                },
            },
            committee: { select: { name: true } },
            manualGroup: { select: { name: true } },
            class: { select: { year: true } },
            interestGroup: { select: { name: true } },
            omegaMembershipGroup: { select: { omegaMembershipLevel: true } },
            studyProgramme: { select: { name: true } },
        }
    }))

    const groupsWithMembers = await Promise.all(groups.map(group => prisma.membership.count({
            where: {
                groupId: group.id,
                ...membershipFilter,
            },
        })
    )).then(members => groups.map((group, i) => ({ ...group, members: members[i] })))

    return groupsWithMembers.map(group => {
        const name = inferGroupName(group)
        const firstOrder = group.memberships[0]?.order ?? group.order
        return {
            ...group,
            firstOrder,
            name,
        }
    })
}

/**
 * Reads expanded groups and sorts them by group type
 */
export async function readGroupsStructured(): Promise<GroupsStructured> {
    const groups = await readGroupsExpanded()
    
    const stuctured = groups.reduce((acc, group) => {
        if (!acc[group.groupType]) {
            acc[group.groupType] = {
                name: GroupTypesConfig[group.groupType].name,
                description: GroupTypesConfig[group.groupType].description,
                groups: []
            }
        }
        acc[group.groupType].groups.push(group)
        return acc
    }, {} as GroupsStructured)
    return stuctured
}

/**
 * This function tries to give a name to a group based on the group type and the group data.
 * @param group - The group to infer the name of
 * @returns 
 */
export function inferGroupName(group: {
    id: Group['id'],
    groupType: Group['groupType'],
    committee?: { name: string } | null,
    manualGroup?: { name: string } | null,
    class?: { year: number } | null,
    interestGroup?: { name: string } | null,
    omegaMembershipGroup?: { omegaMembershipLevel: OmegaMembershipLevel } | null,
    studyProgramme?: { name: string } | null,
}) {
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
    return name
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

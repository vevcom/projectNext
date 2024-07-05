import { GroupTypesConfig, OmegaMembershipLevelConfig, groupsExpandedIncluder } from './ConfigVars'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import { getMembershipFilter } from '@/auth/getMembershipFilter'
import type { Group, User } from '@prisma/client'
import type { ExpandedGroup, GroupsStructured, GroupWithIncludes } from './Types'

export async function readGroups(): Promise<Group[]> {
    return await prismaCall(() => prisma.group.findMany())
}

export async function readCurrentGroupOrder(id: number): Promise<number> {
    return (await prismaCall(() => prisma.group.findUniqueOrThrow({
        where: {
            id,
        },
        select: {
            order: true,
        }
    }))).order
}

export async function readCurrentGroupOrders(ids: number[]): Promise<{id: number, order: number}[]> {
    return await prismaCall(() => prisma.group.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        select: {
            id: true,
            order: true,
        }
    }))
}

export async function readGroup(id: number): Promise<Group> {
    return await prismaCall(() => prisma.group.findUniqueOrThrow({
        where: {
            id,
        },
    }))
}

export async function expandGroup(group: GroupWithIncludes): Promise<ExpandedGroup> {
    const members = await prisma.membership.count({
        where: getMembershipFilter('ACTIVE', group.id)
    })
    const name = inferGroupName(group)
    const firstOrder = group.memberships[0]?.order ?? group.order
    return {
        ...group,
        members,
        firstOrder,
        name,
    }
}

export async function readGroupExpanded(id: number): Promise<ExpandedGroup> {
    const group = await prismaCall(() => prisma.group.findFirstOrThrow({
        where: {
            id,
        },
        include: groupsExpandedIncluder,
    }))
    return expandGroup(group)
}


export async function readGroupsExpanded(): Promise<ExpandedGroup[]> {
    const groups = await prismaCall(() => prisma.group.findMany({
        include: groupsExpandedIncluder,
    }))

    const groupsExpanded = await Promise.all(groups.map(expandGroup))
    return groupsExpanded
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
export function inferGroupName(group: GroupWithIncludes) {
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
        default:
            break
    }
    return name
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

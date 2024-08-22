import { ServerError } from '@/server/error'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { User } from '@prisma/client'
import type { BasicMembership, ExpandedGroup, ExpandedMembership } from './Types'

export async function readGroups(): Promise<ExpandedGroup[]> {
    return await prismaCall(() => prisma.group.findMany())
}

export async function readGroup(id: number): Promise<ExpandedGroup> {
    return await prismaCall(() => prisma.group.findUniqueOrThrow({
        where: {
            id,
        },
    }))
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

export async function readMembershipsOfUser(
    id: number,
    order?: number
): Promise<BasicMembership[]> {
    if (order === undefined) {
        order = (await readCurrenOmegaOrder()).order
    }

    return await prismaCall(() => prisma.membership.findMany({
        where: {
            userId: id,
            order,
        },
        select: {
            admin: true,
            groupId: true,
        }
    }))
}

export async function readGroupsOfUser(id: number) {
    const memberships = await prisma.membership.findMany({
        where: { userId: id },
        include: {
            group: true
        }
    })

    const groupPromises = memberships.map(async (membership) => {
        let include = {}

        switch (membership.group.groupType) {
            case 'CLASS':
                include = { class: true }
                break
            case 'COMMITTEE':
                include = { committee: true }
                break
            case 'INTEREST_GROUP':
                include = { interestGroup: true }
                break
            case 'MANUAL_GROUP':
                include = { manualGroup: true }
                break
            case 'OMEGA_MEMBERSHIP_GROUP':
                include = { omegaMembershipGroup: true }
                break
            case 'STUDY_PROGRAMME':
                include = { studyProgramme: true }
                break
            default:
                break
        }

        const group = await prisma.group.findUnique({
            where: { id: membership.groupId },
            include
        })

        if (group === null) {
            throw new ServerError('NOT FOUND', 'Fant ikke gruppe')
        }

        return group
    })

    const groups = await Promise.all(groupPromises)
    return groups
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

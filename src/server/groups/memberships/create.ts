import 'server-only'
import { readCurrenOmegaOrder } from "@/server/omegaOrder/read"
import { prismaCall } from "@/server/prismaCall"
import { ServerError } from '@/server/error'
import type { ExpandedMembership } from './Types'
import { canEasalyManageMembershipOfGroup, canEasalyManageMembershipOfGroups } from './canEasalyManageMembership'

export async function createMembershipForUser(
    groupId: number,
    userId: number,
    admin: boolean,
    orderArg?: number
): Promise<ExpandedMembership> {
    if (!canEasalyManageMembershipOfGroup(groupId))
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    const order = orderArg ?? (await readCurrenOmegaOrder()).order

    return await prismaCall(() => prisma.membership.create({
        data: {
            group: {
                connect: {
                    id: groupId,
                }
            },
            user: {
                connect: {
                    id: userId,
                },
            },
            omegaOrder: {
                connect: {
                    order,
                }
            },
            admin,
        },
    }))
}

export async function createMembershipsForGroup(
    groupId: number,
    data: { userId: number, admin: boolean }[],
    orderArg?: number,
): Promise<void> {
    if (!canEasalyManageMembershipOfGroup(groupId))
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    const order = orderArg ?? (await readCurrenOmegaOrder()).order

    await prismaCall(() => prisma.membership.createMany({
        data: data.map(({ userId, admin }) => ({
            groupId,
            userId,
            admin,
            order: order,
        })),
        skipDuplicates: true,
    }))
}

export async function createMembershipsForUser(
    userId: number,
    data: { groupId: number, admin: boolean }[],
    orderArg?: number,
): Promise<void> {
    if (!canEasalyManageMembershipOfGroups(data.map(group => group.groupId)))
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    const order = orderArg ?? (await readCurrenOmegaOrder()).order

    await prismaCall(() => prisma.membership.createMany({
        data: data.map(({ groupId, admin }) => ({
            groupId,
            userId,
            admin,
            order,
        })),
        skipDuplicates: true,
    }))
}
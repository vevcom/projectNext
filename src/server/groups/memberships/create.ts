import 'server-only'
import { readCurrenOmegaOrder } from "@/server/omegaOrder/read"
import { prismaCall } from "@/server/prismaCall"
import { CanEasalyManageMembership } from './ConfigVars'
import { ServerError } from '@/server/error'
import type { ExpandedMembership } from './Types'

export async function createMembership(
    groupId: number,
    userId: number,
    admin: boolean,
    orderArg?: number
): Promise<ExpandedMembership> {
    const group = await prismaCall(() => prisma.group.findUniqueOrThrow({
        where: {
            id: groupId
        }
    }))
    if (!CanEasalyManageMembership[group.groupType]) 
        throw new ServerError('BAD PARAMETERS', 'Man kan ikke lage medlemskap til denne gruppen på denne måten')
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
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { BasicMembership, ExpandedGroup, ExpandedMembership } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function readGroups(): Promise<ActionReturn<ExpandedGroup[]>> {
    try {
        const groups = await prisma.group.findMany()

        return { success: true, data: groups }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function readGroup(id: number): Promise<ActionReturn<ExpandedGroup>> {
    try {
        const group = await prisma.group.findUniqueOrThrow({
            where: {
                id,
            },
        })

        return { success: true, data: group }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function readMembersOfGroup(id: number): Promise<ActionReturn<ExpandedMembership[]>> {
    try {
        const count = await prisma.group.count({
            where: {
                id,
            },
        })

        if (count !== 1) return createActionError('BAD PARAMETERS', 'Kan ikke lese medlemmer til en gruppe som ikke finnes.')
    } catch (e) {
        return createPrismaActionError(e)
    }

    try {
        const memberships = await prisma.membership.findMany({
            where: {
                groupId: id,
            },
        })

        return { success: true, data: memberships }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function readMembershipsOfUser(
    id: number,
    order?: number
): Promise<ActionReturn<BasicMembership[]>> {
    if (!order) {
        const currentOrderRes = await readCurrenOmegaOrder()

        if (!currentOrderRes.success) return currentOrderRes

        order = currentOrderRes.data.order
    }

    try {
        const memberships = await prisma.membership.findMany({
            where: {
                userId: id,
                order,
            },
            select: {
                admin: true,
                groupId: true,
            }
        })

        return { success: true, data: memberships }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

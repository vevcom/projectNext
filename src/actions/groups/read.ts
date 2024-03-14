'use server'

import { groupEnumToKey } from './ConfigVars'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { GroupType, Membership, Prisma } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedGroup } from './Types'

export async function readGroups<T extends (GroupType | undefined) = undefined>(
    groupType: T,
): Promise<ActionReturn<ExpandedGroup<T>[]>>
export async function readGroups<T extends(GroupType | undefined) = undefined>(
    groupType: T,
): Promise<ActionReturn<ExpandedGroup<GroupType>[]>> {
    const groupKey: keyof Prisma.GroupInclude | undefined = groupType && groupEnumToKey[groupType]

    const include: Prisma.GroupInclude = groupKey ? {
        [groupKey]: true
    } : {}

    try {
        const groups = await prisma.group.findMany({
            where: {
                groupType,
            },
            include,
        })

        return {
            success: true,
            data: groups,
        }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function readGroup<T extends GroupType>(
    id: number,
    groupType: T
): Promise<ActionReturn<ExpandedGroup<T>>>
export async function readGroup<T extends GroupType>(
    id: number,
    groupType: T
): Promise<ActionReturn<ExpandedGroup<GroupType>>> {
    const groupKey: keyof Prisma.GroupInclude = groupEnumToKey[groupType]

    const include: Prisma.GroupInclude = {
        [groupKey]: true
    }

    try {
        const group = await prisma.group.findUnique({
            where: {
                id,
            },
            include
        })

        if (!group) {
            return createActionError('NOT FOUND', 'Fant ikke gruppe.')
        }

        if (!group[groupKey]) {
            return createActionError('UNKNOWN ERROR', 'Noe gikk galt.')
        }

        return { success: true, data: group }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function readGroupMemberships(groupId: number): Promise<ActionReturn<Membership[]>> {
    try {
        const memberships = await prisma.membership.findMany({
            where: {
                groupId,
                active: true,
            },
        })

        return {
            success: true,
            data: memberships
        }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

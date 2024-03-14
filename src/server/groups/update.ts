import 'server-only'
import { groupEnumToKey } from './ConfigVars'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { GroupType, Membership, Prisma } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedGroup, GroupUpdateInput } from './Types'

export async function updateGroup<T extends GroupType>(
    id: number,
    groupType: T,
    { details, ...data }: GroupUpdateInput<T>,
): Promise<ActionReturn<ExpandedGroup<T>>>
export async function updateGroup<T extends GroupType>(
    id: number,
    groupType: T,
    { details, ...data }: GroupUpdateInput<T>,
): Promise<ActionReturn<ExpandedGroup<GroupType>>> {
    const groupKey: keyof Prisma.GroupInclude = groupEnumToKey[groupType]

    const include: Prisma.GroupInclude = {
        [groupKey]: true
    }

    try {
        const group = await prisma.group.update({
            where: {
                id,
                groupType,
            },
            data: {
                ...data,
                [groupKey]: {
                    update: details,
                }
            },
            include,
        })

        if (!group[groupKey]) {
            return createActionError('UNKNOWN ERROR', 'Noe gikk galt.')
        }

        return {
            success: true,
            data: group,
        }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function addGroupMember(groupId: number, userId: number): Promise<ActionReturn<Membership>> {
    try {
        const membership = await prisma.membership.create({
            data: {
                groupId,
                userId,
                admin: false,
                active: true,
                endOrder: 0,
                startOrder: 0,
            },
        })

        return {
            success: true,
            data: membership,
        }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function removeGroupMember(groupId: number, userId: number) {
    try {
        const membership = await prisma.membership.delete({
            where: {
                userId_groupId: { userId, groupId }
            }
        })

        return {
            success: true,
            data: membership,
        }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

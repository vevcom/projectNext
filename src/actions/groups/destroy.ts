'use server'

import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { Group, GroupType, Prisma } from '@prisma/client'
import { ExpandedGroup } from './Types'
import { groupEnumToKey } from './ConfigVars'

export async function destroyGroup<T extends (GroupType | undefined) = undefined>(
    id: number,
    groupType?: T
): Promise<ActionReturn<ExpandedGroup<T>>>
export async function destroyGroup<T extends (GroupType | undefined) = undefined>(
    id: number,
    groupType?: T
): Promise<ActionReturn<ExpandedGroup<GroupType>>> {
    const groupKey: keyof Prisma.GroupInclude | undefined = groupType && groupEnumToKey[groupType]
    
    const include: Prisma.GroupInclude = groupKey ? {
        [groupKey]: true,
    } : {}

    try {
        const group = await prisma.group.delete({
            where: {
                id,
            },
            include,
        })

        return {
            success: true,
            data: group,
        }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

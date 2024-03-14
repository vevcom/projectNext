import 'server-only'
import { groupEnumToKey } from './ConfigVars'
import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ExpandedGroup } from './Types'
import type { ActionReturn } from '@/actions/Types'
import type { GroupType, Prisma } from '@prisma/client'

export async function destroyGroup<T extends (GroupType | undefined) = undefined>(
    id: number,
    groupType?: T
): Promise<ActionReturn<ExpandedGroup<T>>>
export async function destroyGroup<T extends(GroupType | undefined) = undefined>(
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

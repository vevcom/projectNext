'use server'

import { groupEnumToKey } from './ConfigVars'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { GroupType, Prisma } from '@prisma/client/'
import type { ExpandedGroup, GroupEnumToKey } from './Types'

type CreateGroupArgs<T extends GroupType> = {
    groupType: T,
    name: string,
    membershipRenewal: boolean,
    data: Required<Prisma.GroupCreateInput>[GroupEnumToKey[T]]['create'],
}

/**
 * Creates a group of a given type. The data required for each group depends on
 * which type of group it is.
 */
export async function createGroup<T extends GroupType>({
    groupType,
    name,
    membershipRenewal,
    data
}: CreateGroupArgs<T>): Promise<ActionReturn<ExpandedGroup<Extract<GroupType, T>>>>
export async function createGroup<T extends GroupType>({
    groupType,
    name,
    membershipRenewal,
    data
}: CreateGroupArgs<T>): Promise<ActionReturn<ExpandedGroup<GroupType>>> {
    const groupKey: keyof Prisma.GroupInclude = groupEnumToKey[groupType]

    const include: Partial<Record<GroupEnumToKey[keyof GroupEnumToKey], boolean>> = {
        [groupKey]: true
    }

    try {
        const { [groupKey]: specificGroup, ...genericGroup } = await prisma.group.create({
            data: {
                name,
                groupType,
                membershipRenewal,
                [groupKey]: data,
            },
            include
        })

        if (!specificGroup) {
            return createActionError('UNKNOWN ERROR', 'Noe gikk galt.')
        }

        return { success: true, data: { ...genericGroup, ...specificGroup } }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

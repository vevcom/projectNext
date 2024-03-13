'use server'

import { groupEnumToKey } from './ConfigVars'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { Group, GroupType, Prisma } from '@prisma/client/'
import type { ExpandedGroup, GroupEnumToKey } from './Types'

type BaseGroupArgs<T extends GroupType, withId extends boolean = false> = (
    Omit<Group, 'groupType' | (withId extends true ? '' : 'id')>
) & {
    details: Required<Prisma.GroupCreateInput>[GroupEnumToKey[T]]['create'],
}

type CreateGroupArgs<T extends GroupType> = { groupType: T } & BaseGroupArgs<T>

/**
 * Creates a group of a given type. The data required for each group depends on
 * which type of group it is.
 */
export async function createGroup<T extends GroupType>(args: CreateGroupArgs<T>): Promise<ActionReturn<ExpandedGroup<T>>>
export async function createGroup<T extends GroupType>({
    groupType,
    details,
    ...data
}: CreateGroupArgs<T>): Promise<ActionReturn<ExpandedGroup<GroupType>>> {
    const groupKey: keyof Prisma.GroupInclude = groupEnumToKey[groupType]

    const include: Partial<Record<GroupEnumToKey[keyof GroupEnumToKey], boolean>> = {
        [groupKey]: true
    }

    try {
        const { [groupKey]: specificGroup, ...genericGroup } = await prisma.group.create({
            data: {
                ...data,
                groupType,
                [groupKey]: details,
            },
            include,
        })

        if (!specificGroup) {
            return createActionError('UNKNOWN ERROR', 'Kunne opprette gruppe.')
        }

        return { success: true, data: { ...genericGroup, ...specificGroup } }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

type UpsertGroupArgs<T extends GroupType> = {
    groupType: T,
    where: BaseGroupArgs<T, true>
    create: BaseGroupArgs<T>
    update: BaseGroupArgs<T>
}

/**
 * Upsers a group.
 */
export async function upsertGroup<T extends GroupType>(args: UpsertGroupArgs<T>): Promise<ActionReturn<ExpandedGroup<T>>>
export async function upsertGroup<T extends GroupType>({
    groupType,
    where: { details: whereDetails, ...where },
    create: { details: createDetails, ...create },
    update: { details: updateDetails, ...update },
}: UpsertGroupArgs<T>): Promise<ActionReturn<ExpandedGroup<GroupType>>> {
    const groupKey: keyof Prisma.GroupInclude = groupEnumToKey[groupType]

    const include: Partial<Record<GroupEnumToKey[keyof GroupEnumToKey], boolean>> = {
        [groupKey]: true
    }

    try {
        const { [groupKey]: specificGroup, ...genericGroup } = await prisma.group.upsert({
            where: {
                ...where,
                [groupKey]: whereDetails,
            },
            create: {
                ...create,
                groupType,
                [groupKey]: createDetails,
            },
            update: {
                ...update,
                [groupKey]: updateDetails,
            },
            include,
        })

        if (!specificGroup) {
            return createActionError('UNKNOWN ERROR', 'Kunne ikke opprette/oppdatere gruppe.')
        }

        return { success: true, data: { ...genericGroup, ...specificGroup } }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

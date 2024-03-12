'use server'

import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import { Group, GroupType, Prisma } from '@prisma/client/'

// Map between GroupType and corresponding properties of GroupCreateInput.
// (GroupCreateInput is the type that prisma.group.create accepts.)
// This object is needed to be able to assign the data argument input of
// createGroup to the correct field in prisma.group.create.
const groupEnumToKey = {
    CLASS: 'class',
    COMMITEE: 'commitee',
    INTEREST_GROUP: 'interestGroup',
    OMEGA_MEMBERSHIP: 'omegaMembership',
    STUDY_PROGRAMME: 'studyProgramme',
} as const

type GroupEnumToKey = typeof groupEnumToKey

// Generic type for a specific group type which includes the information from
// both the generic group and specific group.
type ExpandedGroup<T extends GroupType> = Group & (Prisma.GroupGetPayload<{
    select: { [K in GroupEnumToKey[T]]: true }
}> & {
    [K in GroupEnumToKey[T]]: {}
})[GroupEnumToKey[T]]

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
            return createActionError('UNKNOWN ERROR', 'Noe har gått forferdelig galt. Dette burde aldri skje. Databasen har sikkert tatt fyr. :(')
        }

        return { success: true, data: { ...genericGroup, ...specificGroup } }
    } catch (e) {
        return createPrismaActionError(e)
    }
}
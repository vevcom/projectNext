'use server'

import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { Group, GroupType, Prisma } from '@prisma/client/'

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
// type ExpandedGroup<T extends GroupType> = Prisma.GroupGetPayload<{
//     include: { [key in GroupEnumToKey[T]]: true }
// }> & {
//     [key in GroupEnumToKey[T]]: {}
// }

type CreateGroupArgs<T extends GroupType> = {
    groupType: T,
    name: string,
    membershipRenewal: boolean,
    data: Required<Prisma.GroupCreateInput>[GroupEnumToKey[T]]['create'],
}

/**
 * Creats a group of a given type. The data required for each group depends on
 * which type of group it is.
 */
export async function createGroup<T extends GroupType>({
    groupType,
    name,
    membershipRenewal,
    data
}: CreateGroupArgs<T>): Promise<ActionReturn<Group>> {
    const groupKey = groupEnumToKey[groupType]

    try {
        const group = await prisma.group.create({
            data: {
                name,
                groupType,
                membershipRenewal,
                [groupKey]: data,
            },
        })

        return { success: true, data: group }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

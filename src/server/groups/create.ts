import 'server-only'
import { groupEnumToKey } from './ConfigVars'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { GroupType, Prisma } from '@prisma/client/'
import type { ExpandedGroup, GroupCreateInput } from './Types'

/**
 * Creates a group of a given type. The data required for each group depends on
 * which type of group it is.
 */
export async function createGroup<T extends GroupType>(
    groupType: T,
    { details, ...data }: GroupCreateInput<T>,
): Promise<ActionReturn<ExpandedGroup<T>>>
export async function createGroup<T extends GroupType>(
    groupType: T,
    { details, ...data }: GroupCreateInput<T>,
): Promise<ActionReturn<ExpandedGroup<GroupType>>> {
    const groupKey: keyof Prisma.GroupInclude = groupEnumToKey[groupType]

    const include: Prisma.GroupInclude = {
        [groupKey]: true
    }

    try {
        const group = await prisma.group.create({
            data: {
                ...data,
                groupType,
                [groupKey]: {
                    create: details,
                },
            },
            include,
        })

        if (!group[groupKey]) {
            return createActionError('UNKNOWN ERROR', 'Noe gikk galt.')
        }

        return { success: true, data: group }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

// type UpsertGroupArgs<T extends GroupType> = {
//     groupType: T,
//     where: GroupUpdateInput<T>,
//     create: GroupCreateInput<T>,
//     update: GroupUpdateInput<T>,
// }

// /**
//  * Upsers a group.
//  */
// export async function upsertGroup<T extends GroupType>(args: UpsertGroupArgs<T>): Promise<ActionReturn<ExpandedGroup<T>>>
// export async function upsertGroup<T extends GroupType>({
//     groupType,
//     where: { details: whereDetails, ...where },
//     create: { details: createDetails, ...create },
//     update: { details: updateDetails, ...update },
// }: UpsertGroupArgs<T>): Promise<ActionReturn<ExpandedGroup<GroupType>>> {
//     const groupKey: keyof Prisma.GroupInclude = groupEnumToKey[groupType]

//     const include: Prisma.GroupInclude = {
//         [groupKey]: true
//     }

//     try {
//         const { [groupKey]: specificGroup, ...genericGroup } = await prisma.group.upsert({
//             where: {
//                 ...where,
//                 [groupKey]: whereDetails,
//             },
//             create: {
//                 ...create,
//                 groupType,
//                 [groupKey]: createDetails,
//             },
//             update: {
//                 ...update,
//                 [groupKey]: updateDetails,
//             },
//             include,
//         })

//         if (!specificGroup) {
//             return createActionError('UNKNOWN ERROR', 'Kunne ikke opprette/oppdatere gruppe.')
//         }

//         return { success: true, data: { ...genericGroup, ...specificGroup } }
//     } catch (e) {
//         return createPrismaActionError(e)
//     }
// }

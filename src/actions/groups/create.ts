import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler';
import { Group, GroupType,Prisma } from '@prisma/client/'

// Map between GroupType and properties of GroupCreateInput to get correct
// typing for specific group data in createGroup.
const groupEnumToGroupCreateInputKey = {
    CLASS: 'class',
    COMMITEE: 'commitee',
    INTEREST_GROUP: 'interestGroup',
    OMEGA_MEMBERSHIP: 'omegaMembership',
    STUDY_PROGRAMME: 'studyProgramme',
} as const;

type GroupEnumToGroupCreateInputKey = typeof groupEnumToGroupCreateInputKey;

type CreateGroupArgs<T extends GroupType> = {
    groupType: T,
    name: string,
    membershipRenewal: boolean,
    data: Required<Prisma.GroupCreateInput>[GroupEnumToGroupCreateInputKey[T]]['create'],
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
}: CreateGroupArgs<T>) {
    const groupCreateInputKey = groupEnumToGroupCreateInputKey[groupType]

    try {
        prisma.group.create({
            data: {
                name,
                groupType,
                membershipRenewal,
                [groupCreateInputKey]: data,
            },
            include: {
                [groupCreateInputKey]: true,
            },
        })

        return { success: true }
    } catch(e) {
        return errorHandler(e)
    }
}
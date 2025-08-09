import { GroupTypesConfig, OmegaMembershipLevelConfig, groupsExpandedIncluder } from './config'
import { ServerError } from '@/services/error'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import { getMembershipFilter } from '@/auth/getMembershipFilter'
import logger from '@/lib/logger'
import type {
    Group,
    User,
    Committee,
    ManualGroup,
    Class,
    InterestGroup,
    OmegaMembershipGroup,
    StudyProgramme,
} from '@prisma/client'
import type {
    ExpandedGroup,
    GroupsStructured,
    GroupWithDumbRelations,
    GroupWithRelations,
    GroupWithRelationsNameInferencer
} from './Types'

export async function readGroups(): Promise<Group[]> {
    return await prismaCall(() => prisma.group.findMany())
}

export async function readCurrentGroupOrder(id: number): Promise<number> {
    return (await prismaCall(() => prisma.group.findUniqueOrThrow({
        where: {
            id,
        },
        select: {
            order: true,
        }
    }))).order
}

export async function readCurrentGroupOrders(ids: number[]): Promise<{id: number, order: number}[]> {
    return await prismaCall(() => prisma.group.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        select: {
            id: true,
            order: true,
        }
    }))
}

export async function readGroup(id: number): Promise<Group> {
    return await prismaCall(() => prisma.group.findUniqueOrThrow({
        where: {
            id,
        },
    }))
}

export async function expandGroup(group: GroupWithRelationsNameInferencer & {
    membershipsToInferFirstOrder: {order: number}[]
}): Promise<ExpandedGroup> {
    const members = await prisma.membership.count({
        where: getMembershipFilter('ACTIVE', group.id)
    })
    const name = inferGroupName(group)
    const membershipsSorted = group.membershipsToInferFirstOrder.sort(
        (m1, m2) => m1.order - m2.order
    )
    const firstOrder = membershipsSorted.length ? membershipsSorted[0].order : group.order
    return {
        ...group,
        members,
        firstOrder,
        name,
    }
}

export async function readGroupExpanded(id: number): Promise<ExpandedGroup> {
    const group = await prismaCall(() => prisma.group.findFirstOrThrow({
        where: {
            id,
        },
        include: groupsExpandedIncluder,
    })).then(checkGroupValidity).then(grp => ({ ...grp, membershipsToInferFirstOrder: grp.memberships }))
    return expandGroup(group)
}


export async function readGroupsExpanded(): Promise<ExpandedGroup[]> {
    const groups = (await prismaCall(() => prisma.group.findMany({
        include: groupsExpandedIncluder,
    }))).map(checkGroupValidity).map(grp => ({ ...grp, membershipsToInferFirstOrder: grp.memberships }))

    const groupsExpanded = await Promise.all(groups.map(expandGroup))
    return groupsExpanded
}

/**
 * Reads expanded groups and sorts them by group type
 */
export async function readGroupsStructured(): Promise<GroupsStructured> {
    const groupsStructured: GroupsStructured = {
        CLASS: {
            ...GroupTypesConfig.CLASS,
            groups: [],
        },
        COMMITTEE: {
            ...GroupTypesConfig.COMMITTEE,
            groups: [],
        },
        INTEREST_GROUP: {
            ...GroupTypesConfig.INTEREST_GROUP,
            groups: [],
        },
        MANUAL_GROUP: {
            ...GroupTypesConfig.MANUAL_GROUP,
            groups: [],
        },
        OMEGA_MEMBERSHIP_GROUP: {
            ...GroupTypesConfig.OMEGA_MEMBERSHIP_GROUP,
            groups: [],
        },
        STUDY_PROGRAMME: {
            ...GroupTypesConfig.STUDY_PROGRAMME,
            groups: [],
        },
    } satisfies GroupsStructured

    (await readGroupsExpanded()).forEach(group => {
        groupsStructured[group.groupType].groups.push(group)
    })

    return groupsStructured
}

export async function readUsersOfGroups(groups: { groupId: number, admin: boolean }[]): Promise<User[]> {
    return (await prismaCall(() => prisma.membership.findMany({
        where: {
            OR: groups.map(({ admin, groupId }) => ({
                admin: admin !== true ? undefined : true,
                groupId,
            })),
        },
        select: {
            user: true
        }
    }))).map(({ user }) => user)
}

/**
 * WARNING: Make sure that you have actually included the relations in the query
 * This function makes sure the group has a relation to the group type it is supposed to have
 * @param group - The group to check the validity of
 * @throws - If the group is invalid for example groupType committee but no committee relation then
 * it will throw an error
 * @returns - The group with the correct relation (better typing)
 */
export function checkGroupValidity<
    CommitteeKeys extends keyof Committee,
    ManualGroupKeys extends keyof ManualGroup,
    ClassKeys extends keyof Class,
    InterestGroupKeys extends keyof InterestGroup,
    OmegaMembershipGroupKeys extends keyof OmegaMembershipGroup,
    StudyProgrammeKeys extends keyof StudyProgramme,
    ExtraFields extends object,
>(group: GroupWithDumbRelations<
    CommitteeKeys,
    ManualGroupKeys,
    ClassKeys,
    InterestGroupKeys,
    OmegaMembershipGroupKeys,
    StudyProgrammeKeys
> & ExtraFields): GroupWithRelations<
    CommitteeKeys,
    ManualGroupKeys,
    ClassKeys,
    InterestGroupKeys,
    OmegaMembershipGroupKeys,
    StudyProgrammeKeys
> & Omit<ExtraFields, 'committee' | 'manualGroup' | 'class' | 'interestGroup' | 'omegaMembershipGroup' | 'studyProgramme'> {
    const WRONG_GROUP_TYPE_ERROR_STRING = 'Ånei, serveren er i en invalid tilstand. Kontakt en administrator' as const

    switch (group.groupType) {
        case 'COMMITTEE':
            if (!group.committee) {
                logger.error(
                    'Group with type committee without committee relation detected',
                    group
                )
                throw new ServerError('SERVER ERROR', WRONG_GROUP_TYPE_ERROR_STRING)
            }
            return {
                ...group,
                groupType: 'COMMITTEE',
                committee: group.committee,
            }
        case 'MANUAL_GROUP':
            if (!group.manualGroup) {
                logger.error(
                    'Group with type manual group without manual group relation detected',
                    group
                )
                throw new ServerError('SERVER ERROR', WRONG_GROUP_TYPE_ERROR_STRING)
            }
            return {
                ...group,
                groupType: 'MANUAL_GROUP',
                manualGroup: group.manualGroup,
            }
        case 'CLASS':
            if (!group.class) {
                logger.error(
                    'Group with type class without class relation detected',
                    group
                )
                throw new ServerError('SERVER ERROR', WRONG_GROUP_TYPE_ERROR_STRING)
            }
            return {
                ...group,
                groupType: 'CLASS',
                class: group.class,
            }
        case 'INTEREST_GROUP':
            if (!group.interestGroup) {
                logger.error(
                    'Group with type interest group without interest group relation detected',
                    group
                )
                throw new ServerError('SERVER ERROR', WRONG_GROUP_TYPE_ERROR_STRING)
            }
            return {
                ...group,
                groupType: 'INTEREST_GROUP',
                interestGroup: group.interestGroup,
            }
        case 'OMEGA_MEMBERSHIP_GROUP':
            if (!group.omegaMembershipGroup) {
                logger.error(
                    'Group with type omega membership group without omega membership group relation detected',
                    group
                )
                throw new ServerError('SERVER ERROR', WRONG_GROUP_TYPE_ERROR_STRING)
            }
            return {
                ...group,
                groupType: 'OMEGA_MEMBERSHIP_GROUP',
                omegaMembershipGroup: group.omegaMembershipGroup,
            }
        case 'STUDY_PROGRAMME':
            if (!group.studyProgramme) {
                logger.error(
                    'Group with type study programme without study programme relation detected',
                    group
                )
                throw new ServerError('SERVER ERROR', WRONG_GROUP_TYPE_ERROR_STRING)
            }
            return {
                ...group,
                groupType: 'STUDY_PROGRAMME',
                studyProgramme: group.studyProgramme,
            }
        default:
            logger.error('Group with unknown group type detected', group)
            throw new ServerError('SERVER ERROR', WRONG_GROUP_TYPE_ERROR_STRING)
    }
}

export async function readGroupsOfUser(id: number) {
    const memberships = await prisma.membership.findMany({
        where: { userId: id },
        include: {
            group: {
                include: {
                    class: true,
                    committee: true,
                    interestGroup: true,
                    manualGroup: true,
                    omegaMembershipGroup: true,
                    studyProgramme: true,
                }
            }
        }
    })

    const groups = memberships.map(item => checkGroupValidity(item.group))
    return groups
}

/**
 * This function tries to give a name to a group based on the group type and the group data.
 * @param group - The group to infer the name of
 * @returns
 */
export function inferGroupName(group: GroupWithRelationsNameInferencer): string {
    switch (group.groupType) {
        case 'COMMITTEE':
            return group.committee.name
        case 'MANUAL_GROUP':
            return group.manualGroup.name
        case 'CLASS':
            return `${group.class.year}. Klasse`
        case 'INTEREST_GROUP':
            return group.interestGroup.name
        case 'OMEGA_MEMBERSHIP_GROUP':
            return OmegaMembershipLevelConfig[group.omegaMembershipGroup?.omegaMembershipLevel].name
        case 'STUDY_PROGRAMME':
            return group.studyProgramme?.name
        default:
    }
    return 'Group with unknown name'
}

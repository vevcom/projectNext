import '@pn-server-only'
import { groupsExpandedIncluder, groupTypesConfig, OmegaMembershipLevelConfig, readGroupsOfUserIncluder } from './config'
import { groupAuthers } from './authers'
import { userFilterSelection } from '@/services/users/config'
import { ServerError } from '@/services/error'
import { serviceMethod } from '@/services/serviceMethod'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { getMembershipFilter } from '@/auth/getMembershipFilter'
import logger from '@/lib/logger'
import { z } from 'zod'
import type {
    Class,
    Committee,
    InterestGroup,
    ManualGroup,
    OmegaMembershipGroup,
    Prisma,
    StudyProgramme
} from '@prisma/client'
import type {
    ExpandedGroup,
    GroupsStructured,
    GroupWithDumbRelations,
    GroupWithRelations,
    GroupWithRelationsNameInferencer
} from './Types'
import type { UserFiltered } from '@/services/users/Types'

async function expandGroup(group: GroupWithRelationsNameInferencer & {
    membershipsToInferFirstOrder: { order: number }[]
}, prisma: Prisma.TransactionClient): Promise<ExpandedGroup> {
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

export const groupMethods = {
    readGroups: serviceMethod({
        authorizer: () => groupAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => prisma.group.findMany()
    }),

    readCurrentGroupOrder: serviceMethod({
        authorizer: ServerOnlyAuther,
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ prisma, params }) => (await prisma.group.findUniqueOrThrow({
            where: {
                id: params.id,
            },
            select: {
                order: true,
            }
        })).order
    }),

    readCurrentGroupOrders: serviceMethod({
        authorizer: ServerOnlyAuther,
        paramsSchema: z.object({
            ids: z.number().array(),
        }),
        method: async ({ prisma, params }) => prisma.group.findMany({
            where: {
                id: {
                    in: params.ids,
                },
            },
            select: {
                id: true,
                order: true,
            }
        })
    }),

    readGroup: serviceMethod({
        authorizer: ServerOnlyAuther,
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ prisma, params }) => prisma.group.findUniqueOrThrow({
            where: {
                id: params.id,
            },
        })
    }),

    readGroupExpanded: serviceMethod({
        authorizer: () => groupAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ prisma, params }) => {
            const group = await prisma.group.findFirstOrThrow({
                where: {
                    id: params.id,
                },
                include: groupsExpandedIncluder,
            }).then(checkGroupValidity).then(grp => ({ ...grp, membershipsToInferFirstOrder: grp.memberships }))
            return expandGroup(group, prisma)
        }
    }),

    readGroupsExpanded: serviceMethod({
        authorizer: () => groupAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => {
            const groups = (await prisma.group.findMany({
                include: groupsExpandedIncluder,
            })).map(checkGroupValidity).map(grp => ({ ...grp, membershipsToInferFirstOrder: grp.memberships }))

            return await Promise.all(groups.map(group => expandGroup(group, prisma)))
        }
    }),

    readGroupsStructured: serviceMethod({
        authorizer: () => groupAuthers.read.dynamicFields({}),
        method: async () => {
            const groupsStructured: GroupsStructured = {
                CLASS: {
                    ...groupTypesConfig.CLASS,
                    groups: [],
                },
                COMMITTEE: {
                    ...groupTypesConfig.COMMITTEE,
                    groups: [],
                },
                INTEREST_GROUP: {
                    ...groupTypesConfig.INTEREST_GROUP,
                    groups: [],
                },
                MANUAL_GROUP: {
                    ...groupTypesConfig.MANUAL_GROUP,
                    groups: [],
                },
                OMEGA_MEMBERSHIP_GROUP: {
                    ...groupTypesConfig.OMEGA_MEMBERSHIP_GROUP,
                    groups: [],
                },
                STUDY_PROGRAMME: {
                    ...groupTypesConfig.STUDY_PROGRAMME,
                    groups: [],
                },
            } satisfies GroupsStructured

            const groupExpanded = await groupMethods.readGroupsExpanded({ bypassAuth: true })

            groupExpanded.forEach(group => {
                groupsStructured[group.groupType].groups.push(group)
            })

            return groupsStructured
        }
    }),

    readUsersOfGroups: serviceMethod({
        authorizer: ServerOnlyAuther,
        paramsSchema: z.object({
            groups: z.array(z.object({
                groupId: z.number(),
                admin: z.boolean(),
            })),
        }),
        method: async ({ prisma, params }): Promise<UserFiltered[]> => {
            const memberships = await prisma.membership.findMany({
                where: {
                    OR: params.groups.map(({ admin, groupId }) => ({
                        admin: admin !== true ? undefined : true,
                        groupId,
                    })),
                },
                select: {
                    user: {
                        select: userFilterSelection,
                    }
                }
            })

            return memberships.map(({ user }) => user)
        }
    }),

    readGroupsOfUser: serviceMethod({
        authorizer: ServerOnlyAuther,
        paramsSchema: z.object({
            userId: z.number(),
        }),
        method: async ({ prisma, params }) => {
            const memberships = await prisma.membership.findMany({
                where: {
                    userId: params.userId,
                },
                include: {
                    group: {
                        include: readGroupsOfUserIncluder,
                    },
                },
            })

            const groups = memberships.map(item => checkGroupValidity(item.group))

            return groups
        },
    }),
}

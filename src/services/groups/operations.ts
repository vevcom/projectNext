import '@pn-server-only'
import { groupsExpandedIncluder, groupTypesConfig, readGroupsOfUserIncluder } from './constants'
import { groupAuth } from './auth'
import { userFilterSelection } from '@/services/users/constants'
import { ServerError } from '@/services/error'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import { getMembershipFilter } from '@/auth/getMembershipFilter'
import { checkGroupValidity } from '@/lib/groups/checkGroupValidity'
import { inferGroupName } from '@/lib/groups/inferGroupName'
import { z } from 'zod'
import type { ValidatedGroup } from '@/lib/groups/checkGroupValidity'
import type {
    Class,
    Committee,
    InterestGroup,
    ManualGroup,
    OmegaMembershipGroup,
    Prisma,
    StudyProgramme
} from '@/prisma-generated-pn-types'
import type {
    ExpandedGroup,
    GroupsStructured,
    GroupWithDumbRelations,
    GroupWithRelationsNameInferencer
} from './types'
import type { UserFiltered } from '@/services/users/types'

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
 * Throwing convenience wrapper around `checkGroupValidity` (from `@/lib/groups/checkGroupValidity`)
 * for the common case where the caller has no special handling for an invalid group and just wants
 * the call to fail. `checkGroupValidity` itself never throws - it's a plain lib util - so that
 * decision lives here, in the service layer.
 * @throws - If the group is invalid, for example groupType committee but no committee relation
 * @returns - The group with the correct relation (better typing)
 */
export function assertGroupValidity<
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
> & ExtraFields): ValidatedGroup<
    CommitteeKeys, ManualGroupKeys, ClassKeys, InterestGroupKeys, OmegaMembershipGroupKeys, StudyProgrammeKeys, ExtraFields
> {
    const result = checkGroupValidity(group)
    if (!result.valid) {
        throw new ServerError('SERVER ERROR', 'Ånei, serveren er i en invalid tilstand. Kontakt en administrator')
    }
    return result.group
}

export const groupOperations = {
    readGroups: defineOperation({
        authorizer: () => groupAuth.read.dynamicFields({}),
        operation: async ({ prisma }) => prisma.group.findMany()
    }),

    readCurrentGroupOrder: defineSubOperation({
        paramsSchema: () => z.object({
            id: z.number(),
        }),
        operation: () => async ({ prisma, params }) => (await prisma.group.findUniqueOrThrow({
            where: {
                id: params.id,
            },
            select: {
                order: true,
            }
        })).order
    }),

    readCurrentGroupOrders: defineSubOperation({
        paramsSchema: () => z.object({
            ids: z.number().array(),
        }),
        operation: () => async ({ prisma, params }) => prisma.group.findMany({
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

    readGroup: defineSubOperation({
        paramsSchema: () => z.object({
            id: z.number(),
        }),
        operation: () => async ({ prisma, params }) => prisma.group.findUniqueOrThrow({
            where: {
                id: params.id,
            },
        })
    }),

    readGroupExpanded: defineOperation({
        authorizer: () => groupAuth.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: async ({ prisma, params }) => {
            const group = await prisma.group.findFirstOrThrow({
                where: {
                    id: params.id,
                },
                include: groupsExpandedIncluder,
            }).then(assertGroupValidity).then(grp => ({ ...grp, membershipsToInferFirstOrder: grp.memberships }))
            return expandGroup(group, prisma)
        }
    }),

    readGroupsExpanded: defineOperation({
        authorizer: () => groupAuth.read.dynamicFields({}),
        operation: async ({ prisma }) => {
            const groups = (await prisma.group.findMany({
                include: groupsExpandedIncluder,
            })).map(assertGroupValidity).map(grp => ({ ...grp, membershipsToInferFirstOrder: grp.memberships }))

            return await Promise.all(groups.map(group => expandGroup(group, prisma)))
        }
    }),

    readGroupsStructured: defineOperation({
        authorizer: () => groupAuth.read.dynamicFields({}),
        operation: async () => {
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

            const groupExpanded = await groupOperations.readGroupsExpanded({ bypassAuth: true })

            groupExpanded.forEach(group => {
                groupsStructured[group.groupType].groups.push(group)
            })

            return groupsStructured
        }
    }),

    readUsersOfGroups: defineSubOperation({
        paramsSchema: () => z.object({
            groups: z.array(z.object({
                groupId: z.number(),
                admin: z.boolean(),
            })),
        }),
        operation: () => async ({ prisma, params }): Promise<UserFiltered[]> => {
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

    readGroupsOfUser: defineSubOperation({
        paramsSchema: () => z.object({
            userId: z.number(),
        }),
        operation: () => async ({ prisma, params }) => {
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

            const groups = memberships.map(item => assertGroupValidity(item.group))

            return groups
        },
    }),
}

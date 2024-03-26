import 'server-only'
import type { BasicMembership } from '@/server/groups/memberships/Types'
import type { Permission, Prisma, VisibilityPurpose } from '@prisma/client'
import { BypassPermissions } from '@/server/visibility/ConfigVars'

function userMayBypassVisibilityBasedOnPermission(
    permissions: Permission[],
    purpose: VisibilityPurpose,
) {
    return permissions.includes(BypassPermissions[purpose])
}

function isVisibilityPurpose(purpose: string): purpose is VisibilityPurpose {
    return Object.keys(BypassPermissions).includes(purpose)
}

/**
 * Creates a where-filter that can be used in db queries to only return
 * items that mach the users groups (or permission if type is special).
 * This should be used for regularVisibility level.
 * @param groups - The groups the user is a member of
 * @param permissions - The permissions the user has
 * @returns - A where-filter that can be used in db queries. Used n query as
 * ```where: getVisibilityFilter(user.memberships, user.permissions)```
 */
export function getVisibilityFilter(
    groups: BasicMembership[] | undefined,
    permissions: Permission[],
) {
    const groupIds = groups ? groups.map(group => group.groupId) : []

    const bypassers = Object.keys(BypassPermissions).reduce((acc, purpose) => {
        if (!isVisibilityPurpose(purpose)) return acc
        if (!userMayBypassVisibilityBasedOnPermission(permissions, purpose)) return acc
        acc.push({
            visibility: {
                published: true,
                purpose: purpose,
            }
        })
        return acc
    }, [] as {
        visibility: {
            published: true,
            purpose: VisibilityPurpose
        }
    }[]
    )

    return {
        OR: [
            ...bypassers,
            {
                visibility: {
                    published: true,
                    type: 'SPECIAL' as const,
                    regularLevel: {
                        permission: {
                            in: permissions
                        }
                    }
                }
            },
            {
                visibility: {
                    published: true,
                    type: 'SPECIAL' as const,
                    regularLevel: {
                        permission: null
                    }
                }
            },
            {
                visibility: {
                    published: true,
                    type: 'REGULAR' as const,
                    regularLevel: {
                        OR: [
                            {
                                requirements: {
                                    some: {
                                        visibilityRequirmenetGroups: {
                                            some: {
                                                groupId: {
                                                    in: groupIds
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                requirements: {
                                    none: {}
                                }
                            }
                        ]
                    }
                }
            }
        ]
    } satisfies Prisma.ImageCollectionWhereInput
}

export type VisibilityFilter = ReturnType<typeof getVisibilityFilter>

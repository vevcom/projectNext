import '@pn-server-only'
import { BypassPermissions } from '@/services/visibility/ConfigVars'
import type { MembershipFiltered } from '@/services/groups/memberships/Types'
import type { Permission, Prisma, VisibilityPurpose } from '@prisma/client'

function userMayBypassVisibilityBasedOnPermission(
    permissions: Permission[],
    purpose: VisibilityPurpose,
) {
    const bypassPermissionForPurpose = BypassPermissions[purpose]
    if (!bypassPermissionForPurpose) return false
    return permissions.includes(bypassPermissionForPurpose)
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
    groups: MembershipFiltered[] | undefined,
    permissions: Permission[],
) {
    const groupIds = groups ? groups.map(group => group.groupId) : []

    const bypassers = Object.keys(BypassPermissions).reduce((acc, purpose) => {
        if (!isVisibilityPurpose(purpose)) return acc
        if (!userMayBypassVisibilityBasedOnPermission(permissions, purpose)) return acc
        acc.push({
            visibility: {
                published: true,
                purpose,
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
    console.log(permissions)
    return {
        OR: [
            // A user has access if it has the bypass permission for spesific purpose
            ...bypassers,

            // A user has access if the visibility is special and the user has the permission or the
            // permission is null
            {
                visibility: {
                    published: true,
                    specialPurpose: {
                        not: null
                    },
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
                    specialPurpose: {
                        not: null
                    },
                    regularLevel: {
                        permission: null
                    }
                }
            },

            // If the visibility is not special, the user has access if it
            // meets the requirements of the visibility. Or if there are no requirements
            {
                visibility: {
                    published: true,
                    specialPurpose: null,
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

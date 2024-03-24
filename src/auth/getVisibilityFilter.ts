import 'server-only'
import type { Permission } from '@prisma/client'
import { BasicMembership } from '@/server/groups/Types'

/**
 * Creates a where-filter that can be used in db queries to only return items that mach the users groups (or permission if type is special).
 * This should be used for regularVisibility level.
 * @param groups - The groups the user is a member of
 * @param permissions - The permissions the user has
 * @returns - A where-filter that can be used in db queries. Used n query as ```where: getVisibilityFilter(user.memberships, user.permissions)```
 */
export function getVisibilityFilter(
    groups: BasicMembership[] | undefined, 
    permissions: Permission[],
) {
    const groupIds = groups ? groups.map(group => group.groupId) : []

    return {
        OR: [
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
                        requiremenets: {
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
                    }
                }
            }
        ] 
    }
}

export type VisibilityFilter = ReturnType<typeof getVisibilityFilter>

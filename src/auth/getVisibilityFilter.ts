import 'server-only'
import { ExpandedUser } from './getUser'
import type { Permission } from '@prisma/client'
import type { VisibilityType } from '@prisma/client'
import { BasicMembership } from '@/server/groups/Types'


export function getVisibilityFilter(groups: BasicMembership[] | undefined, permissions: Permission[], level: VisibilityType) {
    const groupIds = groups ? groups.map(group => group.groupId) : []

    return level === 'REGULAR' ? {
        OR: [
            {
                visibility: {
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
                    type: 'SPECIAL' as const,
                    regularLevel: {
                        permission: null
                    }
                }
            },
            {
                visibility: {
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
    } : {
        OR: [
            {
                visibility: {
                    type: 'SPECIAL' as const,
                    adminLevel: {
                        permission: {
                            in: permissions
                        }
                    }
                }
            },
            {
                visibility: {
                    type: 'SPECIAL' as const,
                    adminLevel: {
                        permission: null
                    }
                }
            },
            {
                visibility: {
                    type: 'REGULAR' as const,
                    adminLevel: {
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

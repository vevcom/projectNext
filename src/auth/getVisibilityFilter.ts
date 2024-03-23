import 'server-only'
import { ExpandedUser } from './getUser'
import type { Permission } from '@prisma/client'
import type { VisibilityType } from '@prisma/client'


export function getVisibilityFilter(user: ExpandedUser | null, defaultPaermission: Permission[], level: VisibilityType) {
    const permissions = user ? user.permissions : defaultPaermission // if there is a user the defaultPermissions are already on the user
    const groupIds = user ? user.memberships.map(m => m.groupId) : []


    return level === 'REGULAR' ? {
        OR: [
            {
                visibility: {
                    type: 'SPECIAL',
                    regularLevel: {
                        permission: {
                            in: permissions
                        }
                    }
                }
            },
            {
                visibility: {
                    type: 'SPECIAL',
                    regularLevel: {
                        permission: null
                    }
                }
            },
            {
                visibility: {
                    type: 'REGULAR',
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
                    type: 'SPECIAL',
                    adminLevel: {
                        permission: {
                            in: permissions
                        }
                    }
                }
            },
            {
                visibility: {
                    type: 'SPECIAL',
                    adminLevel: {
                        permission: null
                    }
                }
            },
            {
                visibility: {
                    type: 'REGULAR',
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

type VisibilityFilter = ReturnType<typeof getVisibilityFilter>

import type { Prisma } from '@prisma/client'

export const expandedRoleIncluder = {
    permissions: {
        select: {
            permission: true,
        },
    },
    groups: {
        select: {
            groupId: true,
            forAdminsOnly: true,
        },
    },
} as const satisfies Prisma.RoleInclude

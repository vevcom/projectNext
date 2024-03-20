import type { Prisma } from '@prisma/client'

export type ExpandedRole = Prisma.RoleGetPayload<{
    include: {
        permissions: {
            select: {
                permission: true
            }
        },
        groups: {
            select: {
                groupId: true,
                forAdminsOnly: true,
            }
        }
    }
}>

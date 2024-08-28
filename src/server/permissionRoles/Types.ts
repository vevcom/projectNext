import type { permissionCategories } from './ConfigVars'
import type { Prisma, Permission } from '@prisma/client'

export type PermissiobCategory = typeof permissionCategories[number]
export type PermissionInfo = {
    name: string,
    description: string,
    category: PermissiobCategory,
}

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

import type { Prisma, Permission } from '@prisma/client'
import { permissionCategories } from './ConfigVars'

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

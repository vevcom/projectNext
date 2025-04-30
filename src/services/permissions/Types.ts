import type { permissionCategories } from './config'

export type PermissionCategory = typeof permissionCategories[number]
export type PermissionInfo = {
    name: string,
    description: string,
    category: PermissionCategory,
}

// export type ExpandedRole = Prisma.RoleGetPayload<{
//     include: {
//         permissions: {
//             select: {
//                 permission: true
//             }
//         },
//         groups: {
//             select: {
//                 groupId: true,
//                 forAdminsOnly: true,
//             }
//         }
//     }
// }>

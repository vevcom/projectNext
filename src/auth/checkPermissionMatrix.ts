import type { Permission } from '@prisma/client'

export type PermissionMatrix = Permission[][]

/**
 * @param user - The user object to check permissions for.
 * @param permission - permission(s) to chaeck for.
 * The user must have at least one permission for each array in the matrix.
 * [[A, B], [C, D]] means the user must have (either A or B) and (either C or D).
 * @returns - true if the user has the permission(s), false otherwise.
 */
export function checkPermissionMatrix(userPermissions: Permission[], permissionMatrix: PermissionMatrix): boolean {
    return permissionMatrix.every((row) => row.some((p) => userPermissions.includes(p)))
}

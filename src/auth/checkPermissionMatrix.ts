import { Permission } from "@prisma/client"
import type { UserWithPermissions } from "./getUser"

export type PermissionMatrix = Permission[][]

/**
 * @param user - The user object to check permissions for.
 * @param permission - permission(s) to chaeck for.
 * The user must have at least one permission for each array in the matrix.
 * [[A, B], [C, D]] means the user must have (either A or B) and (either C or D).
 * @returns - true if the user has the permission(s), false otherwise.
 */
export function checkPermissionMatrix(user: UserWithPermissions, permissionMatrix: PermissionMatrix): boolean {
    return permissionMatrix.every((row) => row.some((p) => user.permissions.includes(p)));
}
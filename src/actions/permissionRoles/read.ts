'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { readDefaultPermissions, readRoles, readUsersOfRole } from '@/server/permissionRoles/read'
import type { Permission, User } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedRole } from '@/server/permissionRoles/Types'

export async function readRolesAction(): Promise<ActionReturn<ExpandedRole[]>> {
    //TODO: Auth
    return await safeServerCall(() => readRoles())
}

export async function readUsersOfRoleAction(roleId: number): Promise<ActionReturn<User[]>> {
    //TODO: Auth
    return await safeServerCall(() => readUsersOfRole(roleId))
}

export async function readDefaultPermissionsAction(): Promise<ActionReturn<Permission[]>> {
    // Everyone can do this so no auth is required

    return await safeServerCall(() => readDefaultPermissions())
}

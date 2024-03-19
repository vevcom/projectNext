'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { readPermissionsOfDefaultUser, readRoles, readUsersOfRole } from '@/server/rolePermissions/read'
import type { Permission, User } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedRole } from '@/server/rolePermissions/Types'

export async function readRolesAction(): Promise<ActionReturn<ExpandedRole[]>> {
    //TODO: Auth
    return await safeServerCall(() => readRoles())
}

export async function readUsersOfRoleAction(roleId: number): Promise<ActionReturn<User[]>> {
    //TODO: Auth
    return await safeServerCall(() => readUsersOfRole(roleId))
}

export async function readPermissionsOfDefaultUserAction(): Promise<ActionReturn<Permission[]>> {
    // Everyone can do this so no auth is required

    return await safeServerCall(() => readPermissionsOfDefaultUser())
}

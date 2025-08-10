'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { readDefaultPermissions, readGroupsOfRole, readRoles, readUsersOfRole } from '@/services/permissionRoles/read'
import type { Permission, RolesGroups } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedRole } from '@/services/permissionRoles/Types'
import { UserFiltered } from '@/services/users/Types'

export async function readRolesAction(): Promise<ActionReturn<ExpandedRole[]>> {
    //TODO: Auth
    return await safeServerCall(() => readRoles())
}

export async function readUsersOfRoleAction(roleId: number): Promise<ActionReturn<UserFiltered[]>> {
    //TODO: Auth
    return await safeServerCall(() => readUsersOfRole(roleId))
}

export async function readGroupsOfRoleAction(roleId: number): Promise<ActionReturn<RolesGroups[]>> {
    //TODO: Auth
    return await safeServerCall(() => readGroupsOfRole(roleId))
}

export async function readDefaultPermissionsAction(): Promise<ActionReturn<Permission[]>> {
    // Everyone can do this so no auth is required

    return await safeServerCall(() => readDefaultPermissions())
}

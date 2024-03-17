'use server'
import { safeServerCall } from '../safeServerCall'
import { readRoles, readUsersOfRole } from '@/server/rolePermissions/read'
import type { User } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { RoleWithPermissions } from '@/server/rolePermissions/Types'

export async function readRolesAction(): Promise<ActionReturn<RoleWithPermissions[]>> {
    //TODO: Auth
    return await safeServerCall(() => readRoles())
}

export async function readUsersOfRoleAction(roleId: number): Promise<ActionReturn<User[]>> {
    //TODO: Auth
    return await safeServerCall(() => readUsersOfRole(roleId))
}

'use server'
import { removeUserFromRoleSchema } from './schema'
import { safeServerCall } from '../safeServerCall'
import { destroyRole, removeUserFromRole } from '@/server/rolePermissions/destroy'
import { createZodActionError } from '@/actions/error'
import type { RemoveUserFromRoleSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { RoleWithPermissions } from '@/server/rolePermissions/Types'

export async function destroyRoleAction(roleId: number): Promise<ActionReturn<RoleWithPermissions>> {
    //TODO: Auth
    return await safeServerCall(() => destroyRole(roleId))
}

export async function removeUserFromRoleAction(
    rawdata: FormData | RemoveUserFromRoleSchemaType
): Promise<ActionReturn<void, false>> {
    //TODO: Auth

    const parse = removeUserFromRoleSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const { roleId, username } = parse.data

    return await safeServerCall(() => removeUserFromRole(username, roleId))
}

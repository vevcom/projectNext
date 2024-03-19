'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { updateRole } from '@/server/rolePermissions/update'
import type { ActionReturn } from '@/actions/Types'
import { updateRoleValidation } from '@/server/rolePermissions/schema'
import type { UpdateRoleType } from '@/server/rolePermissions/schema'
import { RoleWithPermissions } from '@/server/rolePermissions/Types'

export async function updateRoleAction(rawdata: FormData | UpdateRoleType): Promise<ActionReturn<RoleWithPermissions>> {
    //TODO: auth
    const parse = updateRoleValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateRole(data))
}

'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { updateRole } from '@/server/permissionRoles/update'
import { updateRoleValidation } from '@/server/permissionRoles/schema'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateRoleType } from '@/server/permissionRoles/schema'
import type { ExpandedRole } from '@/server/permissionRoles/Types'

export async function updateRoleAction(rawdata: FormData | UpdateRoleType): Promise<ActionReturn<ExpandedRole>> {
    //TODO: auth
    const parse = updateRoleValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateRole(data))
}

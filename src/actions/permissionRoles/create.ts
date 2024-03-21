'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createRole } from '@/server/permissionRoles/create'
import { createRoleValidation } from '@/server/permissionRoles/validation'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedRole } from '@/server/permissionRoles/Types'
import type { CreateRoleTypes } from '@/server/permissionRoles/validation'

export async function createRoleAction(
    rawdata: FormData | CreateRoleTypes['Type']
): Promise<ActionReturn<ExpandedRole>> {
    //TODO: Auth
    const parse = createRoleValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createRole(data))
}


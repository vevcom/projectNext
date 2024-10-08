'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createRole } from '@/services/permissionRoles/create'
import { createRoleValidation } from '@/services/permissionRoles/validation'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedRole } from '@/services/permissionRoles/Types'
import type { CreateRoleTypes } from '@/services/permissionRoles/validation'

export async function createRoleAction(
    rawdata: FormData | CreateRoleTypes['Type']
): Promise<ActionReturn<ExpandedRole>> {
    //TODO: Auth
    const parse = createRoleValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createRole(data))
}


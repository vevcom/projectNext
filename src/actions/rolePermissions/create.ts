'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createRole } from '@/server/rolePermissions/create'
import { createRoleValidation } from '@/server/rolePermissions/schema'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedRole } from '@/server/rolePermissions/Types'
import type { CreateRoleType } from '@/server/rolePermissions/schema'

export async function createRoleAction(
    rawdata: FormData | CreateRoleType
): Promise<ActionReturn<ExpandedRole>> {
    //TODO: Auth
    const parse = createRoleValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createRole(data))
}


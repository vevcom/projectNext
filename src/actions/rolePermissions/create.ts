'use server'
import { createRoleSchema } from './schema'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createRole } from '@/server/rolePermissions/create'
import type { ActionReturn } from '@/actions/Types'
import type { RoleWithPermissions } from '@/server/rolePermissions/Types'
import type { CreateRoleSchemaType } from './schema'

export async function createRoleAction(
    rawdata: FormData | CreateRoleSchemaType
): Promise<ActionReturn<RoleWithPermissions>> {
    //TODO: Auth

    const parse = createRoleSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createRole(data))
}


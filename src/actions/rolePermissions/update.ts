'use server'
import { updateRoleSchema } from './schema'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { updateRole } from '@/server/rolePermissions/update'
import type { UpdateRoleSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'

export async function updateRoleAction(rawdata: FormData | UpdateRoleSchemaType): Promise<ActionReturn<void, false>> {
    //TODO: auth
    const parse = updateRoleSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const { id, name, permissions } = parse.data

    return await safeServerCall(() => updateRole(id, { name }, permissions))
}

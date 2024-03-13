'use server'
import { updateRoleSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import type { UpdateRoleSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import { updateRole } from '@/server/rolePermissions/update'

export async function updateRoleAction(rawdata: FormData | UpdateRoleSchemaType): Promise<ActionReturn<void, false>> {
    //TODO: auth

    const parse = updateRoleSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const { id, name, permissions } = parse.data

    return await updateRole(id, { name }, permissions)
}

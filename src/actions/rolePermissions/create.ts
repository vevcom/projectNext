'use server'

import { createRoleSchema, addUserToRoleSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { RoleWithPermissions } from '@/server/rolePermissions/Types'
import type { CreateRoleSchemaType, AddUserToRoleSchemaType } from './schema'
import { addUserToRole, createRole } from '@/server/rolePermissions/create'


export async function createRoleAction(rawdata: FormData | CreateRoleSchemaType): Promise<ActionReturn<RoleWithPermissions>> {
    //TODO: Auth
    
    const parse = createRoleSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await createRole(data)
}

export async function addUserToRoleAction(rawdata: FormData | AddUserToRoleSchemaType): Promise<ActionReturn<void, false>> {
    //TODO: Auth
    const parse = addUserToRoleSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const { roleId, username } = parse.data

    return await addUserToRole(username, roleId)
}

'use server'
import { updateUserSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'
import type { UpdateUserSchemaType } from './schema'
import { updateUser } from '@/server/users/update'


export async function updateUserAction(id: number, rawdata: FormData | UpdateUserSchemaType): Promise<ActionReturn<User>> {
    const parse = updateUserSchema.safeParse(rawdata)

    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await updateUser(id, data)
}

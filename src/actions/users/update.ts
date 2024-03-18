'use server'
import { updateUserSchema, userRegisterSchema } from './schema'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError, createActionError } from '@/actions/error'
import { updateUser } from '@/server/users/update'
import { registerUser } from '@/server/auth/credentials'
import { getUser } from '@/auth/getUser'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'
import type { UpdateUserSchemaType } from './schema'

export async function updateUserAction(id: number, rawdata: FormData | UpdateUserSchemaType): Promise<ActionReturn<User>> {
    //TODO: Permission check
    const parse = updateUserSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateUser(id, data))
}

export async function updateUserCredentailsAction(rawdata: FormData): Promise<ActionReturn<null>> {
    const { user, status } = await getUser() //TODO: Permission check
    if (!user) return createActionError(status)
    //TODO: Permission check

    const parse = userRegisterSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => registerUser(user.id, { ...parse.data, username: user.username }))
}

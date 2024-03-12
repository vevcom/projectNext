'use server'
import { updateUserSchema, userRegisterSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'
import type { UpdateUserSchemaType } from './schema'
import { updateUser } from '@/server/users/update'
import { registerUser } from '@/server/auth/credentials'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/user'

export async function updateUserAction(id: number, rawdata: FormData | UpdateUserSchemaType): Promise<ActionReturn<User>> {
    const parse = updateUserSchema.safeParse(rawdata)

    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await updateUser(id, data)
}

export async function updateUserCredentailsAction(rawdata: FormData): Promise<ActionReturn<null>> {
    const { user, status } = await getUser()

    if (!user) {
        return createActionError(status)
    }

    const parse = userRegisterSchema.safeParse(rawdata)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    return await registerUser(user.id, {...parse.data, username: user.username})
}

'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError, createActionError } from '@/actions/error'
import { updateUser } from '@/server/users/update'
import { registerUser } from '@/server/auth/credentials'
import { getUser } from '@/auth/getUser'
import { updateUserValidation, registerUserValidation } from '@/server/users/validation'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'
import type { UpdateUserTypes, RegisterUserTypes } from '@/server/users/validation'

export async function updateUserAction(id: number, rawdata: FormData | UpdateUserTypes['Type']): Promise<ActionReturn<User>> {
    //TODO: Permission check
    const parse = updateUserValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateUser(id, data))
}

export async function updateUserCredentailsAction(rawdata: FormData | RegisterUserTypes['Type']): Promise<ActionReturn<null>> {
    const { user, status } = await getUser() //TODO: Permission check
    if (!user) return createActionError(status)
    //TODO: Permission check

    const parse = registerUserValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => registerUser(user.id, { ...parse.data, username: user.username }))
}

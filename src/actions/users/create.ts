'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createUser } from '@/server/users/create'
import { createUserValidation } from '@/server/users/validation'
import type { CreateUserTypes } from '@/server/users/validation'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param rawdata - The user to create
 * @returns - The created user
 */
export async function createUserAction(rawdata: FormData | CreateUserTypes['Type']): Promise<ActionReturn<User>> {
    const parse = createUserValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createUser(data))
}


'use server'
import { createUserSchema,  } from './schema'
import { createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/user'
import type { CreateUserSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'
import { createUser } from '@/server/users/create'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param rawdata - The user to create
 * @returns - The created user
 */
export async function createUserAction(rawdata: FormData | CreateUserSchemaType): Promise<ActionReturn<User>> {
    const parse = createUserSchema.safeParse(rawdata)
    if (!parse.success) {
        return createZodActionError(parse)
    }
    const data = parse.data
    return await createUser(data)
}


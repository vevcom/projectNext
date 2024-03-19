import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { createUserValidation } from '@/server/users/schema'
import type { User } from '@prisma/client'
import type { CreateUserType } from '@/server/users/schema'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param data - The user to create
 * @returns - The created user
 */
export async function createUser(rawdata: CreateUserType): Promise<User> {
    const data = createUserValidation.detailedValidate(rawdata)
    const passwordHash = data.password //TODO: hash password
    const user = await prismaCall(() => prisma.user.create({
        data: {
            ...data,
            credentials: {
                create: {
                    passwordHash
                },
            },
        },
    }))
    return user
}

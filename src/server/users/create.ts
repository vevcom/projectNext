import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { createUserValidation } from '@/server/users/validation'
import type { User } from '@prisma/client'
import type { CreateUserTypes } from '@/server/users/validation'
import { hashPassword } from '@/auth/password'
import type { Prisma } from '@prisma/client'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param data - The user to create
 * @returns - The created user
 */
export async function createUser(rawdata: CreateUserTypes['Detailed']): Promise<User> {
    // Since "password" and "confirmPassword" are not part of the user model we seperate them from
    // the rest of the data object. That way we can pass it directly to the create user call.
    const { password, confirmPassword, ...data } = createUserValidation.detailedValidate(rawdata)

    const passwordHash = password && await hashPassword(password)
    
    const user = await prismaCall(() => prisma.user.create({
        data: {
            ...data,
            credentials: passwordHash ? {
                create: {
                    passwordHash
                },
            } : undefined,
        },
    }))
    return user
}

import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { createUserValidation } from '@/server/users/validation'
import { hashPassword } from '@/auth/password'
import type { User } from '@prisma/client'
import type { CreateUserTypes } from '@/server/users/validation'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param data - The user to create
 * @returns - The created user
 */
export async function createUser(rawdata: CreateUserTypes['Detailed']): Promise<User> {
    const data = createUserValidation.detailedValidate(rawdata)

    const passwordHash = data.password && await hashPassword(data.password)

    // Since "password" and "confirmPasswor" are not part of the user model they must be
    // deleted before "data" can be unpacked in the create user call.
    Reflect.deleteProperty(data, 'password')
    Reflect.deleteProperty(data, 'confirmPassword')

    return await prismaCall(() => prisma.user.create({
        data: {
            ...data,
            credentials: passwordHash ? {
                create: {
                    passwordHash
                },
            } : undefined,
        },
    }))
}

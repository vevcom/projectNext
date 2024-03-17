import 'server-only'
import prisma from '@/prisma'
import type { Prisma, User } from '@prisma/client'
import { prismaCall } from '../prismaCall'

type CreateUserType = Omit<Prisma.UserCreateInput, 'passwordHash'> & {
    password: string
}

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param data - The user to create
 * @returns - The created user
 */
export async function createUser(data: CreateUserType): Promise<User> {
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
    return user;
}

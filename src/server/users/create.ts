import 'server-only'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { Prisma, User } from '@prisma/client'

type CreateUserType = Omit<Prisma.UserCreateInput, 'passwordHash'> & {
    password: string
}

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param data - The user to create
 * @returns - The created user
 */
export async function createUser(data: CreateUserType): Promise<ActionReturn<User>> {
    const passwordHash = data.password //TODO: hash password
    try {
        const user = await prisma.user.create({
            data: {
                ...data,
                credentials: {
                    create: {
                        passwordHash
                    },
                },
            },
        })

        return { success: true, data: user }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
'use server'
import { createUserSchema } from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { CreateUserSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'

export async function createUser(rawdata: FormData | CreateUserSchemaType): Promise<ActionReturn<User>> {
    const parse = createUserSchema.safeParse(rawdata)

    if (!parse.success) {
        return { success: false, error: parse.error.issues }
    }

    const { username, password, email, firstname, lastname } = parse.data

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                firstname,
                lastname,
                credentials: {
                    create: {
                        passwordHash: password, // TEMPORARY!
                    },
                },
            },
        })

        return { success: true, data: user }
    } catch (error) {
        return errorHandler(error)
    }
}

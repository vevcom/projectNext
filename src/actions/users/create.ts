'use server'
import { createUserSchema, userRegisterSchema } from './schema'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/user'
import type { CreateUserSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'

export async function createUser(rawdata: FormData | CreateUserSchemaType): Promise<ActionReturn<User>> {
    const parse = createUserSchema.safeParse(rawdata)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { username, password, email, firstname, lastname, sex } = parse.data

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                firstname,
                lastname,
                sex,
                credentials: {
                    create: {
                        passwordHash: password, // TEMPORARY!
                    },
                },
            },
        })

        return { success: true, data: user }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

export async function registerUser(rawdata: FormData): Promise<ActionReturn<null>> {
    const { user, status } = await getUser()

    if (!user) {
        return createActionError(status)
    }

    try {
        const parse = userRegisterSchema.safeParse(rawdata)

        if (!parse.success) {
            return createZodActionError(parse)
        }

        const alredyRegistered = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                acceptedTerms: true
            }
        })

        if (alredyRegistered?.acceptedTerms !== null) {
            return createActionError('DUPLICATE', 'User already registered')
        }

        await prisma.$transaction([
            prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    email: parse.data.email,
                    acceptedTerms: new Date(),
                    sex: parse.data.sex
                }
            }),
            prisma.credentials.create({
                data: {
                    passwordHash: parse.data.password,
                    userId: user.id,
                    username: user.username,
                }
            })
        ])

        return { success: true, data: null }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

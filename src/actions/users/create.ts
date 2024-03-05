'use server'
import { userRegisterSchema, userSchema } from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { getUser } from '@/auth'
import type { z as zType } from 'zod'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'

export async function createUser(rawdata: FormData | zType.infer<typeof userSchema>): Promise<ActionReturn<User>> {
    const parse = userSchema.safeParse(rawdata)

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

export async function registerUser(rawdata: FormData): Promise<ActionReturn<null>> {
    const { user, status } = await getUser()

    if (!user) {
        return {
            success: false,
            error: [{
                message: status
            }]
        }
    }

    console.log(rawdata)

    try {
        const parse = userRegisterSchema.safeParse(rawdata)

        if (!parse.success) {
            return { success: false, error: parse.error.issues }
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
            return {
                success: false,
                error: [{
                    message: 'User already registered'
                }]
            }
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
        return errorHandler(error)
    }
}

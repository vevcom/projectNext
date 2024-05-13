import 'server-only'
import { registerUserValidation, updateUserPasswordValidation, updateUserValidation } from './validation'
import { createDefaultSubscriptions } from '@/server/notifications/subscription/create'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { RegisterUserTypes, UpdateUserPasswordTypes, UpdateUserTypes } from './validation'
import type { User } from '@prisma/client'

export async function updateUser(id: number, rawdata: UpdateUserTypes['Detailed']): Promise<User> {
    const data = updateUserValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.user.update({
        where: {
            id,
        },
        data
    }))
}

/**
 * This function completes the last step of user creation: registration.
 * This can only be done once per user.
 *
 * @param id - If of user to register
 * @param rawdata - Registration data.
 * @returns null
 */
export async function registerUser(id: number, rawdata: RegisterUserTypes['Detailed']): Promise<null> {
    const { email, sex, password, mobile, allergies } = registerUserValidation.detailedValidate(rawdata)

    if (!password) throw new ServerError('BAD PARAMETERS', 'Passord er obligatorisk.')

    const storedUser = await prismaCall(() => prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            acceptedTerms: true,
            email: true,
            feideAccount: {
                select: {
                    email: true,
                },
            },
            emailVerified: true,
        },
    }))

    if (!storedUser) throw new ServerError('NOT FOUND', 'Could not find the user with the specified id.')

    if (storedUser.acceptedTerms) throw new ServerError('DUPLICATE', 'Brukeren er allerede registrert.')

    const emailVerified = (
        email === storedUser.feideAccount?.email ||
        email === storedUser.email
    ) ? storedUser.emailVerified : null

    await prismaCall(() => prisma.$transaction([
        prisma.user.update({
            where: {
                id
            },
            data: {
                acceptedTerms: new Date(),
                email,
                sex,
                mobile,
                allergies,
                emailVerified,
            }
        }),
        prisma.credentials.upsert({
            where: {
                userId: id,
            },
            create: {
                passwordHash: password,
                user: {
                    connect: {
                        id,
                    },
                },
            },
            update: {
                passwordHash: password,
            },
        })
    ]))

    await createDefaultSubscriptions(id)

    return null
}

export async function updateUserPassword(id: number, data: UpdateUserPasswordTypes['Detailed']): Promise<null> {
    const parse = updateUserPasswordValidation.detailedValidate(data)

    await prismaCall(() => prisma.$transaction([
        prisma.credentials.update({
            where: {
                userId: id,
            },
            data: {
                passwordHash: parse.password,
            }
        }),
        prisma.user.update({
            where: {
                id,
            },
            data: {
                updatedAt: new Date(),
            }
        })
    ]))

    return null
}

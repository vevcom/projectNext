import 'server-only'
import { registerUserValidation, updateUserValidation } from './validation'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { hashPassword } from '@/auth/password'
import type { RegisterUserTypes, UpdateUserTypes } from './validation'
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
    const { email, sex, password } = registerUserValidation.detailedValidate(rawdata)

    if (!password) throw new ServerError('BAD PARAMETERS', 'Passord er obligatorisk.')

    const alredyRegistered = await prismaCall(() => prisma.user.count({
        where: {
            id,
            NOT: {
                acceptedTerms: null,
            },
        },
    }))

    if (alredyRegistered) throw new ServerError('DUPLICATE', 'Brukeren er allerede registrert.')

    const passwordHash = await hashPassword(password)

    await prismaCall(() => prisma.$transaction([
        prisma.user.update({
            where: {
                id
            },
            data: {
                acceptedTerms: new Date(),
                email,
                sex,
            }
        }),
        prisma.credentials.create({
            data: {
                passwordHash,
                user: {
                    connect: {
                        id,
                    },
                },
            },
        })
    ]))
    return null
}

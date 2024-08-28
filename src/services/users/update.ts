import 'server-only'
import {
    registerUserValidation,
    updateUserPasswordValidation,
    updateUserValidation,
    verifyEmailValidation,
    verifyUserEmailValidation
} from './validation'
import { userFilterSelection } from './ConfigVars'
import { updateUserOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/update'
import { sendVerifyEmail } from '@/services/notifications/email/systemMail/verifyEmail'
import { createDefaultSubscriptions } from '@/services/notifications/subscription/create'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import { NTNUEmailDomain } from '@/services/mail/mailAddressExternal/ConfigVars'
import { hashPassword } from '@/auth/password'
import type { RegisterUserTypes, UpdateUserPasswordTypes, UpdateUserTypes, VerifyEmailType } from './validation'
import type { User } from '@prisma/client'
import type { RegisterNewEmailType, UserFiltered } from './Types'

export async function updateUser(id: number, rawdata: UpdateUserTypes['Detailed']): Promise<User> {
    const data = updateUserValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.user.update({
        where: {
            id,
        },
        data
    }))
}

export async function registerNewEmail(id: number, rawdata: VerifyEmailType['Detailed']): Promise<RegisterNewEmailType> {
    const { email } = verifyEmailValidation.detailedValidate(rawdata)

    const storedUser = await prismaCall(() => prisma.user.findUniqueOrThrow({
        where: {
            id,
        },
        select: {
            ...userFilterSelection,
            feideAccount: {
                select: {
                    email: true,
                }
            }
        }
    }))

    // This test may not be needed if we let users change their email later. Maybe just remove this check
    if (storedUser.emailVerified) throw new ServerError('BAD PARAMETERS', 'Brukeren er allerede verifisert')

    if (email === storedUser.feideAccount?.email) {
        await prismaCall(() => prisma.user.update({
            where: {
                id,
            },
            data: {
                emailVerified: (new Date()).toISOString()
            }
        }))

        return {
            verified: true,
            email,
        }
    }

    if (email.endsWith(`@${NTNUEmailDomain}`)) {
        throw new ServerError(
            'BAD PARAMETERS',
            `Den nye e-posten må være din ${NTNUEmailDomain}-e-post, eller en personlig e-post.`
        )
    }

    await sendVerifyEmail(storedUser, email)

    return {
        verified: false,
        email,
    }
}

/**
 * This function completes the last step of user creation: registration.
 * This can only be done once per user.
 *
 * @param id - If of user to register
 * @param rawdata - Registration data.
 * @returns null
 */
export async function registerUser(id: number, rawdata: RegisterUserTypes['Detailed']): Promise<UserFiltered> {
    const { sex, password, mobile, allergies } = registerUserValidation.detailedValidate(rawdata)

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
            memberships: {
                select: {
                    group: {
                        select: {
                            studyProgramme: {
                                select: {
                                    partOfOmega: true,
                                }
                            }
                        }
                    }
                }
            }
        },
    }))

    if (!storedUser) throw new ServerError('NOT FOUND', 'Could not find the user with the specified id.')

    if (storedUser.acceptedTerms) throw new ServerError('DUPLICATE', 'Brukeren er allerede registrert.')

    const passwordHash = await hashPassword(password)

    const results = await prismaCall(() => prisma.$transaction([
        prisma.user.update({
            where: {
                id
            },
            data: {
                acceptedTerms: new Date(),
                sex,
                mobile,
                allergies,
            },
            select: userFilterSelection
        }),
        prisma.credentials.upsert({
            where: {
                userId: id
            },
            create: {
                user: {
                    connect: {
                        id
                    },
                },
                passwordHash,
            },
            update: {
                passwordHash,
            },
        })
    ]))

    try {
        await createDefaultSubscriptions(id)
    } catch (error) {
        if (!(error instanceof ServerError) || error.errorCode !== 'DUPLICATE') {
            // Duplicate subscriptions doen't do anything, and it will make development easier.
            // In addition will this tolerate if we invalidate a users accepted terms,
            // without deleting the user's subscriptions

            throw error
        }
    }

    const partOfOmega = storedUser.memberships.reduce(
        (acc, val) => acc || (val.group.studyProgramme?.partOfOmega === true),
        false
    )

    await updateUserOmegaMembershipGroup(id, partOfOmega ? 'SOELLE' : 'EXTERNAL', true)

    return results[0]
}

export async function updateUserPassword(id: number, data: UpdateUserPasswordTypes['Detailed']): Promise<null> {
    const parse = updateUserPasswordValidation.detailedValidate(data)

    const passwordHash = await hashPassword(parse.password)

    await prismaCall(() => prisma.credentials.update({
        where: {
            userId: id,
        },
        data: {
            passwordHash,
        }
    }))

    return null
}

export async function verifyUserEmail(id: number, email: string): Promise<UserFiltered> {
    const parse = verifyUserEmailValidation.detailedValidate({ email })

    return await prismaCall(() => prisma.user.update({
        where: {
            id,
        },
        data: {
            ...parse,
            emailVerified: new Date(),
        },
        select: userFilterSelection
    }))
}

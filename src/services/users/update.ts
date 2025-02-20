import 'server-only'
import {
    connectStudentCardValidation,
    registerUserValidation,
    updateUserPasswordValidation,
    updateUserValidation,
    verifyEmailValidation,
    verifyUserEmailValidation
} from './validation'
import { studentCardRegistrationExpiry, userFilterSelection } from './ConfigVars'
import { connectUserStudentCardAuther, registerStudentCardInQueueAuther, updateUserAuther } from './authers'
import { updateUserOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/update'
import { sendVerifyEmail } from '@/services/notifications/email/systemMail/verifyEmail'
import { createDefaultSubscriptions } from '@/services/notifications/subscription/create'
import { ServerError, Smorekopp } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import { hashAndEncryptPassword } from '@/auth/password'
import { NTNUEmailDomain } from '@/services/mail/mailAddressExternal/ConfigVars'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'
import type { RegisterUserTypes, UpdateUserPasswordTypes, VerifyEmailType } from './validation'
import type { RegisterNewEmailType, UserFiltered } from './Types'

export const updateUser = ServiceMethod({
    paramsSchema: z.union([z.object({ id: z.number() }), z.object({ username: z.string() })]),
    dataValidation: updateUserValidation,
    auther: () => updateUserAuther.dynamicFields({}),
    method: async ({ prisma: prisma_, params, data }) => prisma_.user.update({
        where: params,
        data
    })
})

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

    const passwordHash = await hashAndEncryptPassword(password)

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

    const passwordHash = await hashAndEncryptPassword(parse.password)

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

export const registerStudentCardInQueue = ServiceMethod({
    paramsSchema: z.object({
        userId: z.number(),
    }),
    auther: (args) => registerStudentCardInQueueAuther.dynamicFields({
        userId: args.params.userId,
    }),
    method: async (args) => {
        const expiry = (new Date()).getTime() + studentCardRegistrationExpiry * 60 * 1000
        await args.prisma.registerStudentCardQueue.upsert({
            where: {
                userId: args.params.userId,
            },
            update: {
                expiry: new Date(expiry),
            },
            create: {
                user: {
                    connect: {
                        id: args.params.userId,
                    },
                },
                expiry: new Date(expiry),
            }
        })
    }
})

export const connectStudentCard = ServiceMethod({
    auther: () => connectUserStudentCardAuther.dynamicFields({}),
    dataValidation: connectStudentCardValidation,
    opensTransaction: true,
    method: async (args) => {
        const currentQueue = await args.prisma.registerStudentCardQueue.findMany({
            where: {
                expiry: {
                    gt: new Date(),
                },
            },
            orderBy: {
                expiry: 'desc',
            },
            take: 1,
        })

        if (currentQueue.length === 0) {
            throw new Smorekopp(
                'NOT FOUND',
                `No user has placed them selves in the registration queue at ${process.env.DOMAIN}`
            )
        }

        const userId = currentQueue[0].userId
        const result = await args.prisma.$transaction([
            args.prisma.registerStudentCardQueue.delete({
                where: {
                    userId,
                }
            }),
            args.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    studentCard: args.data.studentCard,
                },
                select: userFilterSelection,
            })
        ])

        return result[1]
    }
})


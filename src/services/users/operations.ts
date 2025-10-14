import '@pn-server-only'
import { userSchemas } from './schemas'
import { userAuth } from './auth'
import {
    maxNumberOfGroupsInFilter,
    standardMembershipSelection,
    studentCardRegistrationExpiry,
    userFilterSelection
} from './constants'
import { imageOperations } from '@/services/images/operations'
import { notificationSubscriptionOperations } from '@/services/notifications/subscription/operations'
import { readMembershipsOfUser } from '@/services/groups/memberships/read'
import { NTNUEmailDomain } from '@/services/mail/mailAddressExternal/ConfigVars'
import { sendVerifyEmail } from '@/services/notifications/email/systemMail/verifyEmail'
import { updateUserOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/update'
import { sendUserInvitationEmail } from '@/services/notifications/email/systemMail/userInvitivation'
import { readOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/read'
import { defineOperation } from '@/services/serviceOperation'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { ServerError } from '@/services/error'
import { getMembershipFilter } from '@/auth/getMembershipFilter'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { hashAndEncryptPassword } from '@/auth/passwordHash'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { permissionOperations } from '@/services/permissions/operations'
import { z } from 'zod'
import type { UserPagingReturn } from './types'

export const userOperations = {
    /**
     * This Method creates an user by invitation, and sends the invitation email.
     * WARNING: This should not be used to create users registered by Feide.
     */
    create: defineOperation({
        dataSchema: userSchemas.create,
        authorizer: () => userAuth.create.dynamicFields({}),
        operation: async ({ prisma, data }) => {
            const omegaMembership = await readOmegaMembershipGroup('EXTERNAL')
            const omegaOrder = await readCurrentOmegaOrder()

            const user = await prisma.user.create({
                data: {
                    ...data,
                    memberships: {
                        create: [{
                            groupId: omegaMembership.groupId,
                            order: omegaOrder.order,
                            admin: false,
                            active: true,
                        }]
                    }
                },
            })

            setTimeout(() => sendUserInvitationEmail(user), 1000)
            // The timeout is here to make sure the user is fully created before we send the email.
            // If we don't wait the validation token will be generated first, and will not be valid since
            // the user has changed after the token was generated.

            return user
        }
    }),

    read: defineOperation({
        paramsSchema: z.object({
            username: z.string().optional(),
            id: z.coerce.number().optional(),
            email: z.string().optional(),
            studentCard: z.string().optional(),
        }),
        authorizer: ({ params }) => userAuth.read.dynamicFields(params),
        operation: async ({ prisma, params }) => await prisma.user.findUniqueOrThrow({
            where: {
                id: params.id,
                ...params
            },
            select: userFilterSelection
        })
    }),

    readOrNull: defineOperation({
        paramsSchema: z.object({
            username: z.string().optional(),
            id: z.coerce.number().optional(),
            email: z.string().optional(),
            studentCard: z.string().optional(),
        }),
        authorizer: ({ params }) => userAuth.read.dynamicFields(params),
        operation: async ({ prisma, params }) => await prisma.user.findUnique({
            where: {
                id: params.id, // This is a bit wierd, but now ts is satisfied.
                ...params
            },
            select: userFilterSelection
        })
    }),

    readProfile: defineOperation({
        paramsSchema: z.object({
            username: z.string(),
        }),
        authorizer: ({ params }) => userAuth.readProfile.dynamicFields({ username: params.username }),
        operation: async ({ prisma, params }) => {
            const defaultProfileImage = await imageOperations.readSpecial({
                params: { special: 'DEFAULT_PROFILE_IMAGE' },
            })
            const user = await prisma.user.findUniqueOrThrow({
                where: { username: params.username.toLowerCase() },
                select: {
                    ...userFilterSelection,
                    bio: true,
                    image: true,
                    memberships: {
                        where: {
                            OR: [
                                {
                                    group: {
                                        groupType: 'CLASS',
                                    },
                                    active: true,
                                },
                                {
                                    group: {
                                        groupType: 'COMMITTEE'
                                    }
                                },
                                {
                                    group: {
                                        groupType: 'OMEGA_MEMBERSHIP_GROUP'
                                    },
                                    active: true,
                                },
                                {
                                    group: {
                                        groupType: 'STUDY_PROGRAMME'
                                    },
                                    active: true,
                                },
                            ]
                        },
                        include: {
                            group: {
                                include: {
                                    class: true,
                                    committee: true,
                                    omegaMembershipGroup: true,
                                    studyProgramme: true
                                }
                            }
                        }
                    }
                },
            }).then(async userData => ({
                ...userData,
                image: userData.image || defaultProfileImage,
            }))

            const memberships = await readMembershipsOfUser(user.id)
            const permissions = await permissionOperations.readPermissionsOfUser({
                bypassAuth: true,
                params: {
                    userId: user.id
                }
            })

            return { user, memberships, permissions }
        }
    }),

    readPage: defineOperation({
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number()
            }),
            z.object({
                partOfName: z.string(),
                groups: z.array(z.object({
                    groupOrder: z.union([z.number(), z.literal('ACTIVE')]),
                    groupId: z.number()
                })),
                selectedGroup: z.object({
                    groupOrder: z.union([z.number(), z.literal('ACTIVE')]),
                    groupId: z.number()
                }).nullable().optional()
            })
        ),
        authorizer: () => userAuth.readPage.dynamicFields({}),
        operation: async ({ prisma, params }): Promise<UserPagingReturn[]> => {
            const { page, details } = params.paging
            const words = details.partOfName.split(' ')

            if (details.groups.length > maxNumberOfGroupsInFilter) {
                throw new ServerError('BAD PARAMETERS', 'Too many groups in filter')
            }
            const groupSelection = details.selectedGroup ? [
                getMembershipFilter(details.selectedGroup.groupOrder, details.selectedGroup.groupId)
            ] : []

            const groups = [...details.groups, ...(details.selectedGroup ? [details.selectedGroup] : [])]

            const users = await prisma.user.findMany({
                ...cursorPageingSelection(page),
                select: {
                    ...userFilterSelection,
                    memberships: {
                        select: {
                            admin: true,
                            title: true,
                            groupId: true,
                            group: {
                                select: {
                                    class: { select: { year: true } },
                                    studyProgramme: { select: { code: true } },
                                    omegaMembershipGroup: { select: { omegaMembershipLevel: true } }
                                }
                            }
                        },
                        where: {
                            OR: [
                                {
                                    AND: [
                                        {
                                            OR: standardMembershipSelection,
                                        },
                                        getMembershipFilter('ACTIVE')
                                    ]
                                },
                                {
                                    OR: groupSelection
                                }
                            ]

                        }
                    },
                },
                where: {
                    AND: [
                        ...words.map((word, i) => {
                            const condition = {
                                [i === words.length - 1 ? 'contains' : 'equals']: word,
                                mode: 'insensitive'
                            } as const
                            return {
                                OR: [
                                    { firstname: condition },
                                    { lastname: condition },
                                    { username: condition },
                                ],
                            }
                        }),
                        ...groups.map(group => ({
                            memberships: {
                                some: {
                                    ...getMembershipFilter(group.groupOrder, group.groupId),
                                }
                            }
                        }))
                    ],
                },
                orderBy: [
                    { lastname: 'asc' },
                    { firstname: 'asc' },
                    // We have to sort with at least one unique field to have a
                    // consistent order. Sorting rows by fieds that have the same
                    // value is undefined behaviour in postgresql.
                    { username: 'asc' },
                ]
            })
            return users.map(user => {
                const clas = user.memberships.find(
                    membership => membership.group.class !== null)?.group.class?.year
                const studyProgramme = user.memberships.find(
                    membership => membership.group.studyProgramme !== null)?.group.studyProgramme?.code
                const membershipType = user.memberships.find(
                    membership =>
                        membership.group.omegaMembershipGroup !== null
                )?.group.omegaMembershipGroup?.omegaMembershipLevel
                const title = user.memberships.find(
                    membership => membership.groupId === details.selectedGroup?.groupId)?.title
                const admin = user.memberships.find(
                    membership => membership.groupId === details.selectedGroup?.groupId)?.admin
                return {
                    ...user,
                    class: clas,
                    studyProgramme,
                    membershipType,
                    selectedGroupInfo: {
                        title,
                        admin
                    }
                }
            })
        }
    }),

    connectStudentCard: defineOperation({
        authorizer: () => userAuth.connectStudentCard.dynamicFields({}),
        dataSchema: userSchemas.connectStudentCard,
        opensTransaction: true,
        operation: async ({ prisma, data }) => {
            const currentQueue = await prisma.registerStudentCardQueue.findMany({
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
                throw new ServerError(
                    'NOT FOUND',
                    `No user has placed them selves in the registration queue at ${process.env.DOMAIN}`
                )
            }

            const userId = currentQueue[0].userId
            const result = await prisma.$transaction([
                prisma.registerStudentCardQueue.delete({
                    where: {
                        userId,
                    }
                }),
                prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        studentCard: data.studentCard,
                    },
                    select: userFilterSelection,
                })
            ])

            return result[1]
        }
    }),

    registerStudentCardInQueue: defineOperation({
        paramsSchema: z.object({
            userId: z.number(),
        }),
        authorizer: ({ params }) => userAuth.registerStudentCardInQueue.dynamicFields(params),
        operation: async (args) => {
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
    }),

    update: defineOperation({
        paramsSchema: z.union([z.object({ id: z.number() }), z.object({ username: z.string() })]),
        dataSchema: userSchemas.update,
        authorizer: () => userAuth.update.dynamicFields({}),
        operation: async ({ prisma: prisma_, params, data }) => prisma_.user.update({
            where: params,
            data
        })
    }),


    updatePassword: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: userSchemas.updatePassword,
        authorizer: ({ params }) => userAuth.updatePassword.dynamicFields({ userId: params.id }),
        operation: async ({ prisma, data, params }) => {
            const passwordHash = await hashAndEncryptPassword(data.password)

            await prisma.credentials.update({
                where: {
                    userId: params.id,
                },
                data: {
                    passwordHash,
                }
            })

            return null
        }
    }),

    registerNewEmail: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: ({ params }) => userAuth.registerNewEmail.dynamicFields({ userId: params.id }),
        dataSchema: userSchemas.registerNewEmail,
        operation: async ({ prisma, params, data }) => {
            const storedUser = await prisma.user.findUniqueOrThrow({
                where: {
                    id: params.id,
                },
                select: {
                    ...userFilterSelection,
                    feideAccount: {
                        select: {
                            email: true,
                        }
                    }
                }
            })

            // This test may not be needed if we let users change their email later. Maybe just remove this check
            if (storedUser.emailVerified) throw new ServerError('BAD PARAMETERS', 'Brukeren er allerede verifisert')

            if (data.email === storedUser.feideAccount?.email) {
                await prisma.user.update({
                    where: {
                        id: params.id,
                    },
                    data: {
                        emailVerified: (new Date()).toISOString()
                    }
                })

                return {
                    verified: true,
                    email: data.email,
                }
            }

            if (data.email.endsWith(`@${NTNUEmailDomain}`)) {
                throw new ServerError(
                    'BAD PARAMETERS',
                    `Den nye e-posten må være din ${NTNUEmailDomain}-e-post, eller en personlig e-post.`
                )
            }

            await sendVerifyEmail(storedUser, data.email)

            return {
                verified: false,
                email: data.email,
            }
        }
    }),

    /**
     * This function completes the last step of user creation: registration.
     * This can only be done once per user.
     *
     * @param id - If of user to register
     * @param rawdata - Registration data.
     * @returns null
     */
    register: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: userSchemas.register,
        authorizer: ({ params }) => userAuth.register.dynamicFields({ userId: params.id }),
        opensTransaction: true,
        operation: async ({ prisma, data, params }) => {
            const { sex, password, mobile, allergies } = data

            if (!password) throw new ServerError('BAD PARAMETERS', 'Passord er obligatorisk.')

            const storedUser = await prisma.user.findUnique({
                where: {
                    id: params.id,
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
            })

            if (!storedUser) throw new ServerError('NOT FOUND', 'Could not find the user with the specified id.')

            if (storedUser.acceptedTerms) throw new ServerError('DUPLICATE', 'Brukeren er allerede registrert.')

            const passwordHash = await hashAndEncryptPassword(password)

            const results = await prisma.$transaction([
                prisma.user.update({
                    where: {
                        id: params.id,
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
                        userId: params.id,
                    },
                    create: {
                        user: {
                            connect: {
                                id: params.id,
                            },
                        },
                        passwordHash,
                    },
                    update: {
                        passwordHash,
                    },
                })
            ])

            try {
                await notificationSubscriptionOperations.createDefault({
                    params: {
                        userId: params.id,
                    },
                    bypassAuth: true,
                })
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

            await updateUserOmegaMembershipGroup(params.id, partOfOmega ? 'SOELLE' : 'EXTERNAL', true)

            return results[0]
        }
    }),

    readUserWithBalance: defineOperation({
        authorizer: ({ params }) => userAuth.read.dynamicFields({
            username: params.username || '',
        }),
        paramsSchema: z.object({
            username: z.string().optional(),
            id: z.number().optional(),
            email: z.string().optional(),
            studentCard: z.string().optional(),
        }),
        operation: async ({ prisma: prisma_, params }) => {
            const user = await prisma_.user.findFirstOrThrow({
                where: params,
                include: {
                    image: true,
                }
            })

            return {
                balance: 191900,
                user,
            }
        }
    }),

    //TODO: Make soft delete?
    /**
     * This function deletes a user from the database.
     */
    destroy: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => userAuth.destroy.dynamicFields({}),
        operation: async ({ prisma, params }) => {
            await prisma.user.delete({
                where: {
                    id: params.id,
                }
            })
        }
    }),
}

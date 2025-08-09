import '@pn-server-only'
import { UserAuthers } from './authers'
import { UserConfig } from './config'
import { NotificationSubscriptionMethods } from '@/services/notifications/subscription/methods'
import { readMembershipsOfUser } from '@/services/groups/memberships/read'
import { readPermissionsOfUser } from '@/services/permissionRoles/read'
import { NTNUEmailDomain } from '@/services/mail/mailAddressExternal/ConfigVars'
import { sendVerifyEmail } from '@/services/notifications/email/systemMail/verifyEmail'
import { updateUserOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/update'
import { sendUserInvitationEmail } from '@/services/notifications/email/systemMail/userInvitivation'
import { readOmegaMembershipGroup } from '@/services/groups/omegaMembershipGroups/read'
import { UserSchemas } from '@/services/users/schemas'
import { ServiceMethod } from '@/services/ServiceMethod'
import { ImageMethods } from '@/services/images/methods'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { ServerError } from '@/services/error'
import { getMembershipFilter } from '@/auth/getMembershipFilter'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { hashAndEncryptPassword } from '@/auth/password'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { z } from 'zod'
import type { UserPagingReturn } from './Types'

export namespace UserMethods {
    /**
     * This Method creates an user by invitation, and sends the invitation email.
     * WARNING: This should not be used to create users registered by Feide.
     */
    export const create = ServiceMethod({
        dataSchema: UserSchemas.create,
        auther: () => UserAuthers.create.dynamicFields({}),
        method: async ({ prisma, data }) => {
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
    })

    export const read = ServiceMethod({
        paramsSchema: z.object({
            username: z.string().optional(),
            id: z.coerce.number().optional(),
            email: z.string().optional(),
            studentCard: z.string().optional(),
        }),
        auther: ({ params }) => UserAuthers.read.dynamicFields(params),
        method: async ({ prisma, params }) => await prisma.user.findUniqueOrThrow({
            where: {
                id: params.id,
                ...params
            },
            select: UserConfig.filterSelection
        })
    })

    export const readOrNull = ServiceMethod({
        paramsSchema: z.object({
            username: z.string().optional(),
            id: z.coerce.number().optional(),
            email: z.string().optional(),
            studentCard: z.string().optional(),
        }),
        auther: ({ params }) => UserAuthers.read.dynamicFields(params),
        method: async ({ prisma, params }) => await prisma.user.findUnique({
            where: {
                id: params.id, // This is a bit wierd, but now ts is satisfied.
                ...params
            },
            select: UserConfig.filterSelection
        })
    })

    export const readProfile = ServiceMethod({
        paramsSchema: z.object({
            username: z.string(),
        }),
        auther: ({ params }) => UserAuthers.readProfile.dynamicFields({ username: params.username }),
        method: async ({ prisma, params, session }) => {
            const defaultProfileImage = await ImageMethods.readSpecial.client(prisma).execute({
                params: { special: 'DEFAULT_PROFILE_IMAGE' },
                session,
            })
            const user = await prisma.user.findUniqueOrThrow({
                where: { username: params.username.toLowerCase() },
                select: {
                    ...UserConfig.filterSelection,
                    bio: true,
                    image: true,
                },
            }).then(async userData => ({
                ...userData,
                image: userData.image || defaultProfileImage,
            }))

            const memberships = await readMembershipsOfUser(user.id)
            const permissions = await readPermissionsOfUser(user.id)

            return { user, memberships, permissions }
        }
    })

    export const readPage = ServiceMethod({
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
        auther: () => UserAuthers.readPage.dynamicFields({}),
        method: async ({ prisma, params }): Promise<UserPagingReturn[]> => {
            const { page, details } = params.paging
            const words = details.partOfName.split(' ')

            if (details.groups.length > UserConfig.maxNumberOfGroupsInFilter) {
                throw new ServerError('BAD PARAMETERS', 'Too many groups in filter')
            }
            const groupSelection = details.selectedGroup ? [
                getMembershipFilter(details.selectedGroup.groupOrder, details.selectedGroup.groupId)
            ] : []

            const groups = [...details.groups, ...(details.selectedGroup ? [details.selectedGroup] : [])]

            const users = await prisma.user.findMany({
                ...cursorPageingSelection(page),
                select: {
                    ...UserConfig.filterSelection,
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
                                            OR: UserConfig.standardMembershipSelection,
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
    })

    export const connectStudentCard = ServiceMethod({
        auther: () => UserAuthers.connectStudentCard.dynamicFields({}),
        dataSchema: UserSchemas.connectStudentCard,
        opensTransaction: true,
        method: async ({ prisma, data }) => {
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
                    select: UserConfig.filterSelection,
                })
            ])

            return result[1]
        }
    })

    export const registerStudentCardInQueue = ServiceMethod({
        paramsSchema: z.object({
            userId: z.number(),
        }),
        auther: ({ params }) => UserAuthers.registerStudentCardInQueue.dynamicFields(params),
        method: async (args) => {
            const expiry = (new Date()).getTime() + UserConfig.studentCardRegistrationExpiry * 60 * 1000
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

    export const update = ServiceMethod({
        paramsSchema: z.union([z.object({ id: z.number() }), z.object({ username: z.string() })]),
        dataSchema: UserSchemas.update,
        auther: () => UserAuthers.update.dynamicFields({}),
        method: async ({ prisma: prisma_, params, data }) => prisma_.user.update({
            where: params,
            data
        })
    })


    export const updatePassword = ServiceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: UserSchemas.updatePassword,
        auther: ({ params }) => UserAuthers.updatePassword.dynamicFields({ userId: params.id }),
        method: async ({ prisma, data, params }) => {
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
    })

    export const registerNewEmail = ServiceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        auther: ({ params }) => UserAuthers.registerNewEmail.dynamicFields({ userId: params.id }),
        dataSchema: UserSchemas.registerNewEmail,
        method: async ({ prisma, params, data }) => {
            const storedUser = await prisma.user.findUniqueOrThrow({
                where: {
                    id: params.id,
                },
                select: {
                    ...UserConfig.filterSelection,
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
    })

    /**
     * This function completes the last step of user creation: registration.
     * This can only be done once per user.
     *
     * @param id - If of user to register
     * @param rawdata - Registration data.
     * @returns null
     */
    export const register = ServiceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: UserSchemas.register,
        auther: ({ params }) => UserAuthers.register.dynamicFields({ userId: params.id }),
        opensTransaction: true,
        method: async ({ prisma, data, params, session }) => {
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
                    select: UserConfig.filterSelection
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
                await NotificationSubscriptionMethods.createDefault.client(prisma).execute({
                    params: {
                        userId: params.id,
                    },
                    session,
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
    })
    export const readUserWithBalance = ServiceMethod({
        auther: ({ params }) => UserAuthers.read.dynamicFields({
            username: params.username || '',
        }),
        paramsSchema: z.object({
            username: z.string().optional(),
            id: z.number().optional(),
            email: z.string().optional(),
            studentCard: z.string().optional(),
        }),
        method: async ({ prisma: prisma_, params }) => {
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
    })

    //TODO: Make soft delete?
    /**
     * This function deletes a user from the database.
     */
    export const destroy = ServiceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        auther: () => UserAuthers.destroy.dynamicFields({}),
        method: async ({ prisma, params }) => {
            await prisma.user.delete({
                where: {
                    id: params.id,
                }
            })
        }
    })
}

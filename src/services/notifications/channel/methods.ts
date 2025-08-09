import '@pn-server-only'
import { NotificationChannelAuthers } from './authers'
import { NotificationChannelSchemas } from './schemas'
import { NotificationChannelConfig } from './config'
import { booleanOperationOnMethods } from '@/services/notifications/notificationMethodOperations'
import { ServiceMethod } from '@/services/ServiceMethod'
import { DEFAULT_NOTIFICATION_ALIAS } from '@/services/notifications/email/config'
import { NotificationConfig } from '@/services/notifications/config'
import { ServerError } from '@/services/error'
import { NotificationSchemas } from '@/services/notifications/schemas'
import { z } from 'zod'
import type { ExpandedNotificationChannel, NotificationMethodGeneral } from '@/services/notifications/Types'

export namespace NotificationChannelMethods {

    export const create = ServiceMethod({
        auther: () => NotificationChannelAuthers.create.dynamicFields({}),
        dataSchema: NotificationChannelSchemas.create,
        opensTransaction: true,
        paramsSchema: z.object({
            availableMethods: NotificationSchemas.notificationMethodFields,
            defaultMethods: NotificationSchemas.notificationMethodFields,
        }),
        method: async ({ prisma, data, params }): Promise<ExpandedNotificationChannel> => {
            if (!NotificationChannelSchemas.validateMethods(params.availableMethods, params.defaultMethods)) {
                throw new ServerError('BAD PARAMETERS', 'Default methods cannot exceed available methods.')
            }

            const channel = await prisma.notificationChannel.create({
                data: {
                    name: data.name,
                    description: data.description,
                    parent: {
                        connect: {
                            id: data.parentId,
                        }
                    },
                    availableMethods: {
                        create: params.availableMethods,
                    },
                    defaultMethods: {
                        create: params.defaultMethods,
                    },
                    mailAlias: {
                        connect: {
                            address: DEFAULT_NOTIFICATION_ALIAS,
                        }
                    }
                },
                include: NotificationChannelConfig.includer,
            })

            if (NotificationChannelSchemas.validateMethods(NotificationConfig.allMethodsOff, params.defaultMethods)) {
                return channel
            }

            await prisma.$transaction(async (tx) => {
                const parentSubscriptions = await tx.notificationSubscription.findMany({
                    where: {
                        channelId: data.parentId
                    },
                    include: {
                        methods: {
                            select: NotificationConfig.allMethodsOn,
                        }
                    }
                })

                await Promise.all(parentSubscriptions
                    .map(s => ({
                        ...s,
                        subscriptionMethods: booleanOperationOnMethods(s.methods, channel.defaultMethods, 'AND')
                    }))
                    .filter(s =>
                        !NotificationChannelSchemas.validateMethods(NotificationConfig.allMethodsOff, s.subscriptionMethods)
                    )
                    .map(s => tx.notificationSubscription.create({
                        data: {
                            user: {
                                connect: {
                                    id: s.userId,
                                },
                            },
                            channel: {
                                connect: {
                                    id: channel.id,
                                },
                            },
                            methods: {
                                create: s.subscriptionMethods
                            }
                        }
                    }))
                )
            })

            return channel
        }
    })

    export const readMany = ServiceMethod({
        auther: () => NotificationChannelAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => await prisma.notificationChannel.findMany({
            include: NotificationChannelConfig.includer,
        })
    })

    export const readDefault = ServiceMethod({
        auther: () => NotificationChannelAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => await prisma.notificationChannel.findMany({
            where: {
                defaultMethods: {
                    OR: NotificationConfig.methods.map(method => ({
                        [method]: true
                    }))
                }
            },
            include: NotificationChannelConfig.includer,
        })
    })

    export const update = ServiceMethod({
        auther: () => NotificationChannelAuthers.update.dynamicFields({}),
        dataSchema: NotificationChannelSchemas.update,
        paramsSchema: z.object({
            id: z.number(),
            availableMethods: NotificationSchemas.notificationMethodFields,
            defaultMethods: NotificationSchemas.notificationMethodFields,
        }),
        opensTransaction: true,
        method: async ({ prisma, data, params, session }) => {
            if (!NotificationChannelSchemas.validateMethods(params.availableMethods, params.defaultMethods)) {
                throw new ServerError('BAD PARAMETERS', 'Default methods cannot exceed available methods.')
            }


            // Check if the channel is special
            const channel = await prisma.notificationChannel.findUniqueOrThrow({
                where: {
                    id: params.id,
                },
                select: {
                    special: true,
                    availableMethods: true,
                    defaultMethods: true,
                }
            })

            let updateParentId = false

            // Not allowed to change the parent of ROOT
            if (channel.special !== 'ROOT') {
                const allChannels = await readMany.client(prisma).execute({
                    session,
                    bypassAuth: true,
                })

                if (!NotificationChannelSchemas.validateNewParent(params.id, data.parentId, allChannels)) {
                    throw new ServerError('BAD PARAMETERS', 'Cannot set parentId in a loop')
                }

                updateParentId = true
            }

            function methodsAreEqual(lhs: NotificationMethodGeneral, rhs: NotificationMethodGeneral) {
                for (let i = 0; i < NotificationConfig.methods.length; i++) {
                    if (lhs[NotificationConfig.methods[i]] !== rhs[NotificationConfig.methods[i]]) {
                        return false
                    }
                }
                return true
            }


            return await prisma.$transaction(async (tx) => {
                if (!methodsAreEqual(params.availableMethods, channel.availableMethods)) {
                    await tx.notificationMethod.update({
                        where: {
                            id: channel.availableMethods.id,
                        },
                        data: params.availableMethods,
                    })
                }

                if (!methodsAreEqual(params.defaultMethods, channel.defaultMethods)) {
                    await tx.notificationMethod.update({
                        where: {
                            id: channel.defaultMethods.id,
                        },
                        data: params.defaultMethods,
                    })
                }


                return tx.notificationChannel.update({
                    where: {
                        id: params.id,
                    },
                    data: {
                        name: data.name,
                        description: data.description,
                        ...(updateParentId ? { parent: { connect: { id: data.parentId } } } : {}),
                        mailAlias: {
                            connect: {
                                id: data.mailAliasId,
                            }
                        }
                    },
                    include: NotificationChannelConfig.includer,
                })
            })
        }
    })

    // It doesn't seem that this function is used yet. -Theodor
    export const destroy = ServiceMethod({
        auther: () => NotificationChannelAuthers.destroy.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        opensTransaction: true,
        method: async ({ prisma, params }) => prisma.$transaction(async (tx) => {
            // NOTE: this should maybe be just a archive not a delete

            const results = await tx.notificationChannel.delete({
                where: {
                    id: params.id,
                },
                include: NotificationChannelConfig.includer,
            })

            await tx.notificationMethod.deleteMany({
                where: {
                    OR: [
                        { id: results.availableMethodsId },
                        { id: results.defaultMethodsId },
                    ]
                }
            })

            return results
        })
    })

}

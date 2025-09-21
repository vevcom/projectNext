import { NotificationSubscriptionAuthers } from './authers'
import { NotificationSubscriptionConfig } from './config'
import { SubscriptionSchemas } from './schemas'
import { NotificationChannelConfig } from '@/services/notifications/channel/config'
import { NotificationConfig } from '@/services/notifications/config'
import { NotificationChannelSchemas } from '@/services/notifications/channel/schemas'
import { NotificationChannelMethods } from '@/services/notifications/channel/methods'
import { serviceMethod } from '@/services/serviceMethod'
import { ServerOnly } from '@/auth/auther/ServerOnly'
import { ServerError } from '@/services/error'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import type { Subscription } from './Types'
import type { NotificationMethodGeneral } from '@/services/notifications/Types'


export namespace NotificationSubscriptionMethods {

    export const read = serviceMethod({
        paramsSchema: z.object({
            userId: z.number(),
        }),
        authorizer: ({ params }) => NotificationSubscriptionAuthers.read.dynamicFields(params),
        method: async ({ prisma, params }) => await prisma.notificationSubscription.findMany({
            where: {
                userId: params.userId,
            },
            include: NotificationSubscriptionConfig.includer,
        }),
    })

    export const createDefault = serviceMethod({
        authorizer: ServerOnly,
        paramsSchema: z.object({
            userId: z.number(),
        }),
        opensTransaction: true,
        method: async ({ prisma, params, session }) => {
            const channels = await NotificationChannelMethods.readDefault({
                session,
                bypassAuth: true,
            })

            await prisma.$transaction(channels.map(channel =>
                prisma.notificationSubscription.create({
                    data: {
                        user: {
                            connect: {
                                id: params.userId,
                            }
                        },
                        channel: {
                            connect: {
                                id: channel.id,
                            }
                        },
                        methods: {
                            create: channel.defaultMethods,
                        }
                    }
                })
            ))
        }
    })


    // eslint-disable-next-line
    async function createTransactionPart(
        prisma: Prisma.TransactionClient,
        userId: number,
        channelId: number,
        methods: NotificationMethodGeneral
    ): Promise<(() => Promise<Subscription>) | null> {
        const whereFilter = {
            userId_channelId: {
                userId,
                channelId,
            }
        }

        const subscription = await prisma.notificationSubscription.findUnique({
            where: whereFilter
        })

        const subscriptionExists = subscription !== null

        // If all methods are off, we delete the relation
        if (NotificationChannelSchemas.validateMethods(NotificationConfig.allMethodsOff, methods)) {
            // No change, do nothing
            if (!subscriptionExists) {
                return null
            }

            // Delete the realtion
            return async () => {
                const sub = await prisma.notificationSubscription.delete({
                    where: whereFilter,
                    include: NotificationSubscriptionConfig.includer,
                })

                await prisma.notificationMethod.delete({
                    where: {
                        id: sub.methodsId
                    }
                })

                return sub
            }
        }

        // Verify that the new methods are a subset of the available methods
        const notificaionChannel = await prisma.notificationChannel.findUniqueOrThrow({
            where: {
                id: channelId,
            },
            include: NotificationChannelConfig.includer,
        })

        if (!NotificationChannelSchemas.validateMethods(notificaionChannel.availableMethods, methods)) {
            throw new ServerError('BAD PARAMETERS', 'The methods must a subset of the available methods')
        }

        // Update the relation
        if (subscriptionExists) {
            return async () => {
                const results = await prisma.notificationMethod.update({
                    where: {
                        id: subscription.methodsId,
                    },
                    data: methods,
                    select: NotificationConfig.allMethodsOn,
                })

                return {
                    ...subscription,
                    methods: results,
                }
            }
        }

        // Create the relation
        return () => prisma.notificationSubscription.create({
            data: {
                channel: {
                    connect: {
                        id: channelId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
                methods: {
                    create: methods,
                },
            },
            include: NotificationSubscriptionConfig.includer,
        })
    }

    export const update = serviceMethod({
        authorizer: ({ params }) => NotificationSubscriptionAuthers.update.dynamicFields(params),
        paramsSchema: z.object({
            userId: z.number(),
        }),
        dataSchema: SubscriptionSchemas.update,
        method: async ({ prisma, params, data }): Promise<Subscription[]> => {
            // Prepare updates and validate the data with the data in the database
            const transactionParts = (await Promise.all(
                data.subscriptions.map(subscription =>
                    createTransactionPart(prisma, params.userId, subscription.channelId, subscription.methods)
                )
            )).filter(i => i) as (() => Promise<Subscription>)[]

            // Update the subscriptions
            return await Promise.all(
                transactionParts.map(part => part())
            )
        }
    })
}

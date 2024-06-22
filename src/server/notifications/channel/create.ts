import 'server-only'
import { createNotificaionChannelValidation, validateMethods } from './validation'
import { booleanOperationOnMethods } from '@/server/notifications/notificationMethodOperations'
import { DEFAULT_NOTIFICATION_ALIAS } from '@/server/notifications/email/ConfigVars'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import { allMethodsOff, allMethodsOn, type NotificationChannel, type NotificationMethod } from '@/server/notifications/Types'
import type { CreateNotificationChannelType } from './validation'

export async function createNotificationChannel({
    name,
    description,
    parentId,
    availableMethods,
    defaultMethods,
}: CreateNotificationChannelType['Detailed'] & {
    availableMethods: NotificationMethod
    defaultMethods: NotificationMethod
}): Promise<NotificationChannel> {
    const parse = createNotificaionChannelValidation.detailedValidate({
        name,
        description,
        parentId,
    })

    if (!validateMethods(availableMethods, defaultMethods)) {
        throw new ServerError('BAD PARAMETERS', 'Default methods cannot exceed available methods.')
    }

    const channel = await prismaCall(() => prisma.notificationChannel.create({
        data: {
            name: parse.name,
            description: parse.description,
            parent: {
                connect: {
                    id: parse.parentId,
                },
            },
            availableMethods: {
                create: availableMethods,
            },
            defaultMethods: {
                create: defaultMethods,
            },
            mailAlias: {
                connect: {
                    address: DEFAULT_NOTIFICATION_ALIAS,
                },
            },
        },
        include: {
            availableMethods: {
                select: allMethodsOn,
            },
            defaultMethods: {
                select: allMethodsOn,
            },
        }
    }))

    // Return if all default methods are set to off
    if (validateMethods(allMethodsOff, defaultMethods)) {
        return channel
    }

    await prismaCall(() => prisma.$transaction(async () => {
        const parentSubscriptions = await prisma.notificationSubscription.findMany({
            where: {
                channelId: parse.parentId
            },
            include: {
                methods: {
                    select: allMethodsOn,
                }
            }
        })

        await Promise.all(parentSubscriptions
            .map(s => ({
                ...s,
                subscriptionMethods: booleanOperationOnMethods(s.methods, channel.defaultMethods, 'AND')
            }))
            .filter(s => !validateMethods(allMethodsOff, s.subscriptionMethods))
            .map(s => prisma.notificationSubscription.create({
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
    }))


    return channel
}

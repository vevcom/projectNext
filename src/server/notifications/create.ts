import 'server-only'
import prisma from '@/prisma'
import type { NotificationChannel, NotificationMethod, Notification } from '@prisma/client';
import { prismaCall } from '@/server/prismaCall';
import { ServerError } from '@/server/error';
import { NotificationMethods } from './ConfigVars';
import { dispatchMethods } from './methods/methods';

/**
 * Dispatches a notification to the subscribing users
 * 
 * @param notification - The notification to be dispatched.
 * @returns A promise that resolves to the dispatched notification.
 * @throws {ServerError} If the notification is not found or if there is an error finding users.
 */
export async function dispatchNotification(notification: Notification): Promise<Notification> {

    const results = await prismaCall(() => prisma.notification.findUnique({
        where: {
            id: notification.id,
        },
        select: {
            channel: {
                select: {
                    id: true,
                    name: true,
                    parentId: true,
                    availableMethods: true,
                }
            }
        }
    }))

    if (!results) {
        throw new ServerError('NOT FOUND', "Cannot find the notification")
    }

    const channel = results.channel

    type RecordWithMethods = Record<number, Omit<NotificationMethod, 'id'>>

    async function findUsers(channelId: number, iterations=50): Promise<RecordWithMethods> {
        if (iterations < 0) {
            throw new ServerError('SERVER ERROR', "Too many iterations when finding users")
        }

        const subscriptionsP = prismaCall(() => prisma.notificationSubscription.findMany({
            where: {
                channelId,
            },
            select: {
                userId: true,
                methods: true,
            }
        }))

        const channelP = prismaCall(() => prisma.notificationChannel.findUnique({
            where: {
                id: channelId,
            },
            select: {
                special: true,
                parentId: true,
            }
        }))

        const [subscriptions, channel] = await Promise.all([subscriptionsP, channelP])

        const parsedResults = Object.fromEntries(
            subscriptions.filter(u => u.methods).map(u => [
                u.userId,
                Object.fromEntries(
                    Object.entries(u.methods).filter(([key]) => key != 'id')
                ) as Omit<NotificationMethod, 'id'>,
            ])
        )

        if (!channel) {
            throw new ServerError('SERVER ERROR', "Invalid channelId")
        }

        if (channel.special === "ROOT") {
            return parsedResults
        }

        const parentResults = await findUsers(channel.parentId, iterations - 1)

        Object.entries(parentResults).forEach(([key, value]) => {
            if (!parsedResults[key]) {
                parsedResults[key] = value
            }
        })

        return parsedResults
    }

    const users = await findUsers(channel.id)
    const methods = channel.availableMethods
    
    await Promise.all(
        NotificationMethods.filter(m => methods[m]).map(method => 
            dispatchMethods[method](notification, channel, Object.keys(users).map(u => Number(u)))
        )
    )

    return notification
}

/**
 * A function to send a notification
 * @param channelId - The channel to send the notification to
 * @param visibilityId - Who can se the notification
 * @param title - The title of the notification
 * @param message - The message of the notification
 * @returns The notification
 */
export async function createNotification(
    channelId: number,
//  visibilityId: number,
    title: string,
    message: string
): Promise<Notification> {
    const results = await prismaCall(() => prisma.notification.create({
        data: {
            title,
            message,
            channel: {
                connect: {
                    id: channelId
                }
            }
        }
    }))

    await dispatchNotification(results);

    return results
}

/**
 * A function to create a notification channel
 * @param info - The info to create the notification channel 
 * @returns - The createde notification channel
 */
export async function createNotificationChannel({
    name,
    description,
    parentChannelId,
    defaultMethods,
    availableMethods,
} : {
    name: string,
    description?: string,
    parentChannelId: number,
    defaultMethods: Omit<NotificationMethod, 'id'>,
    availableMethods: Omit<NotificationMethod, 'id'>,
}): Promise<NotificationChannel> {
    
    return await prismaCall(() => prisma.notificationChannel.create({
        data: {
            name,
            description,
            parent: {
                connect: {
                    id: parentChannelId,
                }
            },
            defaultMethods: {
                create: defaultMethods,
            },
            availableMethods: {
                create: availableMethods,
            },
        }
    }))
}
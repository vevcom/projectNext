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
                    subscriptions: {
                        select: {
                            methods: true,
                            userId: true,
                        }
                    }
                }
            }
        }
    }))

    if (!results) {
        throw new ServerError('NOT FOUND', "Cannot find the notification")
    }

    const channel = {...results.channel, subscriptions: undefined}
    const users = results.channel.subscriptions

    // TODO: Filter users by visibility
    
    await Promise.all(
        NotificationMethods.filter(m => channel.availableMethods[m]).map(method => 
            dispatchMethods[method](
                notification,
                channel,
                users.filter(u => u.methods[method]).map(u => u.userId)
            )
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
import 'server-only'
import { CreateNotificationType, createNotificaionValidation } from './validation';
import { prismaCall } from '../prismaCall';
import { Notification, SpecialNotificationChannel } from '@prisma/client';
import { NotificationChannel, allMethodsOn, notificationMethods } from './Types';
import { userFilterSelection } from '../users/ConfigVars';
import { dispathMethod } from './dispatch';
import { UserFiltered } from '../users/Types';

/**
 * Creates a notification.
 * 
 * @param data - The data for creating the notification.
 * @returns A promise that resolves with the created notification.
 */
export async function createNotification(data: CreateNotificationType['Detailed']) {

    const parse = createNotificaionValidation.detailedValidate(data)

    return await prismaCall(() => prisma.notification.create({
        data: {
            title: parse.title,
            message: parse.message,
            channel: {
                connect: {
                    id: parse.channelId,
                },
            },
        }
    }))
}

/**
 * Dispatches a special notification to the specified notification channel.
 * 
 * @param special - The special notification channel to dispatch the notification to.
 * @param title - The title of the notification.
 * @param message - The message content of the notification.
 * @returns A promise that resolves with an object containing the dispatched notification and the number of recipients.
 */
export async function dispatchSpecialNotification(special: SpecialNotificationChannel, title: string, message: string):
Promise<{
    notification: Notification
    recipients: number
}> {
    const channel = await prismaCall(() => prisma.notificationChannel.findUniqueOrThrow({
        where: {
            special,
        }
    }))

    return await dispatchNotification({
        channelId: channel.id,
        title,
        message,
    })
}

/**
 * Dispatches a notification with the specified data.
 * 
 * @param data - The detailed data for dispatching the notification.
 * @returns A promise that resolves with an object containing the dispatched notification and the number of recipients.
 */
export async function dispatchNotification(data: CreateNotificationType['Detailed']) {
    const notification = await createNotification(data);

    const results = await prismaCall(() => prisma.notificationChannel.findUniqueOrThrow({
        where: {
            id: notification.channelId,
        },
        include: {
            subscriptions: {
                select: {
                    methods: {
                        select: allMethodsOn,
                    },
                    user: {
                        select: userFilterSelection,
                    },
                },
            },
            availableMethods: {
                select: allMethodsOn,
            },
            defaultMethods: {
                select: allMethodsOn,
            }
        },
    }))

    notificationMethods.forEach(method => {
        if (!results.availableMethods[method]) {
            return;
        }

        const userFiltered = results.subscriptions.filter(s => s.methods[method]).map(s => s.user)

        dispathMethod[method]({
            ...results,
            subscriptions: undefined,
        } as NotificationChannel, notification, userFiltered);
    })

    return {
        notification,
        recipients: results.subscriptions.length
    }
}
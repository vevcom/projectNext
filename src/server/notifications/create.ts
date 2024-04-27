import 'server-only'
import { CreateNotificationType, createNotificaionValidation } from './validation';
import { prismaCall } from '../prismaCall';
import { SpecialNotificationChannel } from '@prisma/client';
import { NotificationChannel, allMethodsOn, notificationMethods } from './Types';
import { userFilterSelection } from '../users/ConfigVars';
import { dispathMethod } from './dispatch';



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

export async function dispatchSpecialNotification(special: SpecialNotificationChannel, title: string, message: string) {
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
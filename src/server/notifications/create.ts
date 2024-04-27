import 'server-only'
import { CreateNotificationType, createNotificaionValidation } from './validation';
import { prismaCall } from '../prismaCall';
import { SpecialNotificationChannel } from '@prisma/client';
import { allMethodsOn } from './Types';
import { userFilterSelection } from '../users/ConfigVars';



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

    const recipients = await prismaCall(() => prisma.notificationChannel.findMany({
        where: {
            id: notification.channelId,
        },
        select: {
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
        },
    }))

    console.log(recipients)

    return {
        notification,
        recipients: recipients.length
    }
}
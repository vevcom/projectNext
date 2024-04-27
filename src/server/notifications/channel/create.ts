import 'server-only';
import { NotificationChannel, NotificationMethod } from '../Types';
import { CreateNotificationChannelType, createNotificaionChannelValidation, parseMethods } from './validation';
import { prismaCall } from '@/server/prismaCall';
import { connect } from 'http2';



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

    return await prismaCall(() => prisma.notificationChannel.create({
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
        },
        include: {
            availableMethods: true,
            defaultMethods: true,
        }
    }))


}
import 'server-only'
import { createNotificaionChannelValidation, validateMethods } from './validation'
import { DEFAULT_NOTIFICATION_ALIAS } from '@/server/notifications/email/ConfigVars'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { NotificationChannel, NotificationMethod } from '@/server/notifications/Types'
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
            mailAlias: {
                connect: {
                    address: DEFAULT_NOTIFICATION_ALIAS,
                },
            },
        },
        include: {
            availableMethods: true,
            defaultMethods: true,
        }
    }))
}

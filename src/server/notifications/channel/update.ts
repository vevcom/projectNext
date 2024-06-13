import 'server-only'
import { updateNotificaionChannelValidation, validateMethods, validateNewParent } from './validation'
import { readNotificationChannels } from './read'
import { allMethodsOn, notificationMethods } from '@/server/notifications/Types'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { NotificationChannel, NotificationMethod } from '@/server/notifications/Types'
import type { UpdateNotificationChannelType } from './validation'


export async function updateNotificationChannel({
    id,
    name,
    description,
    parentId,
    mailAliasId,
    defaultMethods,
    availableMethods,
}: UpdateNotificationChannelType['Detailed'] & {
    defaultMethods: NotificationMethod,
    availableMethods: NotificationMethod,
}): Promise<NotificationChannel> {
    const parse = updateNotificaionChannelValidation.detailedValidate({
        id,
        name,
        description,
        parentId,
        mailAliasId,
    })

    if (!validateMethods(availableMethods, defaultMethods)) {
        throw new ServerError('BAD PARAMETERS', 'Default methods cannot exceed available methods.')
    }

    // Check if the channel is special
    const channel = await prismaCall(() => prisma.notificationChannel.findUniqueOrThrow({
        where: {
            id: parse.id,
        },
        select: {
            special: true,
            availableMethods: true,
            defaultMethods: true,
        }
    }))

    let updateParentId = false

    // Not allowed to change the parent of ROOT
    if (channel.special !== 'ROOT') {
        const allChannels = await readNotificationChannels()

        if (!validateNewParent(parse.id, parse.parentId, allChannels)) {
            throw new ServerError('BAD PARAMETERS', 'Cannot set parentId in a loop')
        }

        updateParentId = true
    }

    function methodsAreEqual(lhs: NotificationMethod, rhs: NotificationMethod) {
        for (let i = 0; i < notificationMethods.length; i++) {
            if (lhs[notificationMethods[i]] !== rhs[notificationMethods[i]]) {
                return false
            }
        }
        return true
    }

    return await prismaCall(async () => prisma.$transaction(async () => {
        if (!methodsAreEqual(availableMethods, channel.availableMethods)) {
            await prisma.notificationMethod.update({
                where: {
                    id: channel.availableMethods.id,
                },
                data: availableMethods,
            })
        }

        if (!methodsAreEqual(defaultMethods, channel.defaultMethods)) {
            await prisma.notificationMethod.update({
                where: {
                    id: channel.defaultMethods.id,
                },
                data: defaultMethods,
            })
        }


        return prisma.notificationChannel.update({
            where: {
                id: parse.id,
            },
            data: {
                name: parse.name,
                description: parse.description,
                ...(updateParentId ? { parent: { connect: { id: parse.parentId } } } : {}),
                mailAlias: {
                    connect: {
                        id: parse.mailAliasId,
                    }
                }
            },
            include: {
                defaultMethods: {
                    select: allMethodsOn,
                },
                availableMethods: {
                    select: allMethodsOn,
                }
            }
        })
    }))
}

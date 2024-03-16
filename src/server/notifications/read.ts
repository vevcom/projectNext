import 'server-only'
import prisma from '@/prisma'
import type { NotificationChannel, NotificationMethod } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import { getUser } from '@/auth/user'
import { createPrismaActionError } from '@/actions/error'
import type { NotificationChannelWithMethods } from './Types'

/**
 * Reads all notification channels from the database.
 * @returns - A list of all notification channels.
 */
export async function readChannels() : Promise<ActionReturn<NotificationChannelWithMethods[]>> {
    await getUser({
        required: true,
        requiredPermissions: [ "NOTIFICATION_CHANNEL_READ" ]
    })

    try {
        const channels = await prisma.notificationChannel.findMany({
            orderBy: {
                id: 'asc',
            },
            select: {
                id: true,
                name: true,
                description: true,
                special: true,
                parentId: true,
                availableMethods: true,
                defaultMethods: true,
            }
        })

        const remove_id = (channel: NotificationMethod) => {
            const { id, ...rest } = channel
            return rest
        }

        return {
            success: true,
            data: channels.map(channel => ({
                ...channel,
                availableMethods: remove_id(channel.availableMethods),
                defaultMethods: channel.defaultMethods ? remove_id(channel.defaultMethods) : undefined,
            })),
        }
    } catch (error) {
        return createPrismaActionError(error);
    }
}
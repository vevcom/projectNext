import 'server-only'
import prisma from '@/prisma'
import type { NotificationMethod } from '@prisma/client'
import type { NotificationChannelWithMethods } from './Types'
import { prismaCall } from '../prismaCall'

/**
 * Reads all notification channels from the database.
 * @returns - A list of all notification channels.
 */
export async function readChannels() : Promise<NotificationChannelWithMethods[]> {

    const channels = await prismaCall(() => prisma.notificationChannel.findMany({
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
    }))

    const remove_id = (channel: NotificationMethod) => {
        const { id, ...rest } = channel
        return rest
    }

    return channels.map(channel => ({
        ...channel,
        availableMethods: remove_id(channel.availableMethods),
        defaultMethods: channel.defaultMethods ? remove_id(channel.defaultMethods) : undefined,
    }))
}
import 'server-only'
import prisma from '@/prisma'
import type { SpecialNotificationChannel } from '@prisma/client'
import type { NotificationChannelWithMethods } from './Types'
import { prismaCall } from '../prismaCall'
import { ServerError } from '../error'
import { convertFromPrismaMethods } from './ConfigVars'

/**
 * Reads all notification channels from the database.
 * @returns - A list of all notification channels.
 */
export async function readChannels() : Promise<NotificationChannelWithMethods[]> {

    const channels = await prismaCall(() => prisma.notificationChannel.findMany({
        orderBy: {
            id: 'asc',
        },
        include: {
            availableMethods: true,
            defaultMethods: true,
        }
    }))

    return channels.map(convertFromPrismaMethods)
}

export async function readSpecialChannel(special: SpecialNotificationChannel) : Promise<NotificationChannelWithMethods> {
    const results = await prismaCall(() => prisma.notificationChannel.findUnique({
        where: {
            special,
        },
        include: {
            availableMethods: true,
            defaultMethods: true,
        }
    }))

    if (!results) {
        throw new ServerError('NOT FOUND', 'Special channel not found')
    }

    return convertFromPrismaMethods(results)
}

export async function readChannelsAsFlatObject() : Promise<{
    [key: number]: NotificationChannelWithMethods
}> {
    const channels = await readChannels()

    return channels.reduce((acc, channel) => {
        acc[channel.id] = channel
        return acc
    }, {} as {[key: number]: NotificationChannelWithMethods})
}
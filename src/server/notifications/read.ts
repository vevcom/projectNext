import 'server-only'
import prisma from '@/prisma'
import type { SpecialNotificationChannel } from '@prisma/client'
import type { NotificationChannelWithMethods, NotificationSubscriptionWithMethods } from './Types'
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

/**
 * Reads a special notification channel from the database.
 * 
 * @param special - The special notification channel to read.
 * @returns A promise that resolves to the notification channel with methods.
 * @throws {ServerError} If the special channel is not found.
 */
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

/**
 * Reads the notification channels and returns them as a flat object with channel IDs as keys.
 * @returns A promise that resolves to an object with channel IDs as keys and notification channels as values.
 */
export async function readChannelsAsFlatObject() : Promise<{
    [key: number]: NotificationChannelWithMethods
}> {
    const channels = await readChannels()

    return channels.reduce((acc, channel) => {
        acc[channel.id] = channel
        return acc
    }, {} as {[key: number]: NotificationChannelWithMethods})
}

/**
 * Retrieves the notification subscriptions for a given user.
 * 
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of notification subscriptions.
 */
export async function readUserSubscriptions(userId: number):
Promise<NotificationSubscriptionWithMethods[]>
{

    return await prismaCall(() => prisma.notificationSubscription.findMany({
        where: {
            userId,
        },
        include: {
            methods: true,
        }
    }))

}
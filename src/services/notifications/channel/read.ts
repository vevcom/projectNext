import '@pn-server-only'
import { allMethodsOn, notificationMethods } from '@/services/notifications/Types'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { ExpandedNotificationChannel } from '@/services/notifications/Types'


export async function readNotificationChannels(): Promise<ExpandedNotificationChannel[]> {
    return await prismaCall(() => prisma.notificationChannel.findMany({
        include: {
            defaultMethods: {
                select: allMethodsOn,
            },
            availableMethods: {
                select: allMethodsOn,
            },
        },
    }))
}

export async function readDefaultNotificationChannels(): Promise<ExpandedNotificationChannel[]> {
    return await prismaCall(() => prisma.notificationChannel.findMany({
        where: {
            defaultMethods: {
                OR: notificationMethods.map(m => ({
                    [m]: true
                }))
            }
        },
        include: {
            defaultMethods: {
                select: allMethodsOn,
            },
            availableMethods: {
                select: allMethodsOn,
            },
        }
    }))
}

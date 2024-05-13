import 'server-only'
import { allMethodsOn, notificationMethods } from '@/server/notifications/Types'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { NotificationChannel } from '@/server/notifications/Types'


export async function readAllNotificationChannels(): Promise<NotificationChannel[]> {
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

export async function readDefaultNotificationChannels(): Promise<NotificationChannel[]> {
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

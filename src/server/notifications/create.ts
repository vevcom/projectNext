import 'server-only';
import prisma from '@/prisma'
import type { NotificationChannel, NotificationMethod } from '@prisma/client';
import { createPrismaActionError } from '@/actions/error';
import { ActionReturn } from '@/actions/Types';
import { prismaCall } from '../prismaCall';

/**
 * A function to send a notification
 * @param channelId - The channel to send the notification to
 * @param visibilityId - Who can se the notification
 * @param title - The title of the notification
 * @param message - The message of the notification
 * @returns
 */
export function createNotification(channelId: number, visibilityId: number, title: string, message: string): void {
    return;
}

/**
 * A function to create a notification channel
 * @param info - The info to create the notification channel 
 * @returns - The createde notification channel
 */
export async function createNotificationChannel({
    name,
    parentChannelId,
    defaultMethods,
    availableMethods,
} : {
    name: string,
    parentChannelId: number,
    defaultMethods: Omit<NotificationMethod, 'id'>,
    availableMethods: Omit<NotificationMethod, 'id'>,
}): Promise<NotificationChannel> {
    

    return await prismaCall(() => prisma.notificationChannel.create({
        data: {
            name,
            description,
            parent: {
                connect: {
                    id: parentChannelId,
                }
            },
            defaultMethods: {
                create: defaultMethods,
            },
            availableMethods: {
                create: availableMethods,
            },
        }
    }))
}
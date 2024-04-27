import 'server-only'
import { NotificationChannel } from '../Types';
import { prismaCall } from '@/server/prismaCall';
import prisma from '@/prisma';



export async function readAllNotificationChannels(): Promise<NotificationChannel[]> {
    return await prismaCall(() => prisma.notificationChannel.findMany({
        include: {
            defaultMethods: true,
            availableMethods: true,
        }
    }));
}



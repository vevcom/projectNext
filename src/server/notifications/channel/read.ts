import 'server-only'
import { NotificationChannel, allMethodsOn } from '../Types';
import { prismaCall } from '@/server/prismaCall';
import prisma from '@/prisma';



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
    }));
}



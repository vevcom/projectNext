import 'server-only'
import { destroyNotificaionChannelValidation } from './validation'
import { allMethodsOn } from '@/server/notifications/Types'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedNotificationChannel } from '@/server/notifications/Types'
import type { DestroyNotificationChannelType } from './validation'


export async function destroyNotificationChannel(data: DestroyNotificationChannelType['Detailed']):
Promise<ExpandedNotificationChannel> {
    const { id } = destroyNotificaionChannelValidation.detailedValidate(data)

    // NOTE: this should maybe be just a archive not a delete

    return await prismaCall(async () => prisma.$transaction(async () => {
        const results = await prisma.notificationChannel.delete({
            where: {
                id,
            },
            include: {
                availableMethods: {
                    select: allMethodsOn,
                },
                defaultMethods: {
                    select: allMethodsOn,
                },
            }
        })

        await prisma.notificationMethod.deleteMany({
            where: {
                OR: [
                    { id: results.availableMethodsId },
                    { id: results.defaultMethodsId },
                ]
            }
        })

        return results
    }))
}

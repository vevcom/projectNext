import 'server-only'
import { updateSubscriptionValidation, validateMethods } from './validation'
import { allMethodsOff, allMethodsOn } from '@/server/notifications/Types'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { ServerError } from '@/server/error'
import type { Subscription } from './Types'
import type { NotificationMethod } from '@/server/notifications/Types'
import type { UpdateSubscriptionType } from './validation'


export async function updateSubscription({
    channelId,
    userId,
    methods,
}: UpdateSubscriptionType['Detailed'] & {
    methods: NotificationMethod,
}): Promise<Subscription | null> {
    const parse = updateSubscriptionValidation.detailedValidate({
        channelId,
        userId,
    })

    const whereFilter = {
        userId_channelId: {
            userId: parse.userId,
            channelId: parse.channelId,
        }
    }

    const subscription = await prismaCall(() => prisma.notificationSubscription.findUnique({
        where: whereFilter
    }))

    const subscriptionExists = subscription !== null

    // If all methods are off, we delete the relation
    if (validateMethods(allMethodsOff, methods)) {
        // No change, do nothing
        if (!subscriptionExists) {
            return null
        }

        // Delete the realtion
        return prismaCall(async () => prisma.$transaction(async () => {
            const sub = await prisma.notificationSubscription.delete({
                where: whereFilter,
                include: {
                    methods: {
                        select: allMethodsOn
                    },
                },
            })

            await prisma.notificationMethod.delete({
                where: {
                    id: sub.methodsId
                }
            })

            return sub
        }))
    }


    // Verify that the new methods are a subset of the available methods
    const notificaionChannel = await prismaCall(() => prisma.notificationChannel.findUniqueOrThrow({
        where: {
            id: channelId,
        },
        include: {
            availableMethods: {
                select: allMethodsOn,
            },
        },
    }))

    if (!validateMethods(notificaionChannel.availableMethods, methods)) {
        throw new ServerError('BAD PARAMETERS', 'The mtethods must a subset of the availeble methods')
    }

    // Update the relation
    if (subscriptionExists) {
        const results = await prismaCall(() => prisma.notificationMethod.update({
            where: {
                id: subscription.methodsId,
            },
            data: methods,
            select: allMethodsOn,
        }))

        return {
            ...subscription,
            methods: results,
        }
    }

    // Create the relation

    return await prismaCall(() => prisma.notificationSubscription.create({
        data: {
            channel: {
                connect: {
                    id: parse.channelId,
                },
            },
            user: {
                connect: {
                    id: parse.userId,
                },
            },
            methods: {
                create: methods,
            },
        },
        include: {
            methods: {
                select: allMethodsOn,
            }
        }
    }))
}

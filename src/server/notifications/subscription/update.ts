import 'server-only'
import { validateMethods } from './validation'
import { allMethodsOff, allMethodsOn } from '@/server/notifications/Types'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { ServerError } from '@/server/error'
import type { MinimizedSubscription, Subscription } from './Types'
import type { NotificationMethodGeneral } from '@/server/notifications/Types'

async function createTransactionPart(
    userId: number,
    channelId: number,
    methods: NotificationMethodGeneral
): Promise<(() => Promise<Subscription>) | null> {
    const whereFilter = {
        userId_channelId: {
            userId,
            channelId,
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
            return null;
        }

        // Delete the realtion
        return async () => {
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
        }
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
        throw new ServerError('BAD PARAMETERS', 'The methods must a subset of the available methods')
    }

    // Update the relation
    if (subscriptionExists) {
        return async () => {
            const results = await prisma.notificationMethod.update({
                where: {
                    id: subscription.methodsId,
                },
                data: methods,
                select: allMethodsOn,
            })
    
            return {
                ...subscription,
                methods: results,
            }
        }
    }

    // Create the relation
    return () => prisma.notificationSubscription.create({
        data: {
            channel: {
                connect: {
                    id: channelId,
                },
            },
            user: {
                connect: {
                    id: userId,
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
    })
}


export async function updateSubscriptions(
    userId: number,
    subscriptions: MinimizedSubscription[]
): Promise<Subscription[]> {

    // Prepare updates and validate the data with the data in the database
    const transactionParts = (await Promise.all(
        subscriptions.map(s => createTransactionPart(userId, s.channelId, s.methods))
    )).filter(i => i) as (() => Promise<Subscription>)[]

    // Update the subscriptions
    return await prismaCall(() =>
        prisma.$transaction(async () => {
            return Promise.all(
                transactionParts.map(part => part())
            )
        })
    )
}

'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn } from '@/actions/Types'
import { getUser } from '@/auth/getUser'
import { readUserSubscriptions } from '@/services/notifications/subscription/read'
import type { MinimizedSubscription, Subscription } from '@/services/notifications/subscription/Types'
import { updateSubscriptions } from '@/services/notifications/subscription/update'
import { parseSubscriptionMatrix, updateSubscriptionValidation } from '@/services/notifications/subscription/validation'

export async function readSubscriptionsAction(userId?: number):
Promise<ActionReturn<Subscription[]>> {
    const { authorized, status, user, permissions } = await getUser({
        requiredPermissions: [
            ['NOTIFICATION_CHANNEL_READ'],
            ['NOTIFICATION_SUBSCRIPTION_READ'],
        ],
        userRequired: true,
    })

    if (!authorized) return createActionError(status)

    if (!userId) {
        userId = user.id
    }

    if (userId !== user.id && !permissions.includes('NOTIFICATION_SUBSCRIPTION_READ_OTHER')) {
        return createActionError('UNAUTHORIZED')
    }

    return await safeServerCall(() => readUserSubscriptions(userId))
}

export async function updateSubscriptionsAction(userId: number, subscriptions: MinimizedSubscription[]):
Promise<ActionReturn<Subscription[]>> {
    const { authorized, status, user, permissions } = await getUser({
        requiredPermissions: [['NOTIFICATION_SUBSCRIPTION_UPDATE']],
        userRequired: true,
    })
    if (!authorized) return createActionError(status)

    if (userId !== user.id && !permissions.includes('NOTIFICATION_SUBSCRIPTION_UPDATE_OTHER')) {
        return createActionError('UNAUTHORIZED')
    }

    const parse = parseSubscriptionMatrix(subscriptions)
    if (!parse.success) return createZodActionError(parse)

    const userParse = updateSubscriptionValidation.typeValidate({ userId })
    if (!userParse.success) return createZodActionError(userParse)

    return await safeServerCall(() => updateSubscriptions(userParse.data.userId, parse.data))
}

'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { updateSubscriptions } from '@/server/notifications/subscription/update'
import { parseSubscriptionMatrix, updateSubscriptionValidation } from '@/server/notifications/subscription/validation'
import type { ActionReturn } from '@/actions/Types'
import type { MinimizedSubscription, Subscription } from '@/server/notifications/subscription/Types'


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

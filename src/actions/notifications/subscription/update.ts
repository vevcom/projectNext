'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { updateSubscriptions } from '@/server/notifications/subscription/update'
import type { ActionReturn } from '@/actions/Types'
import type { MinimizedSubscription, Subscription } from '@/server/notifications/subscription/Types'
import { parseSubscriptionMatrix, updateSubscriptionValidation } from '@/server/notifications/subscription/validation'


export async function updateSubscriptionsAction(userId: number, subscriptions: MinimizedSubscription[]):
Promise<ActionReturn<Subscription[]>> {
    const { authorized, status, user } = await getUser({
        requiredPermissions: [['NOTIFICATION_SUBSCRIPTION_UPDATE']],
        userRequired: true,
    })
    if (!authorized) return createActionError(status)

    const parse = parseSubscriptionMatrix(subscriptions)
    if (!parse.success) return createZodActionError(parse)
    
    const userParse = updateSubscriptionValidation.typeValidate({ userId })
    if (!userParse.success) return createZodActionError(userParse)

    return await safeServerCall(() => updateSubscriptions(userParse.data.userId, parse.data))
}

'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { updateSubscriptions } from '@/server/notifications/subscription/update'
import { parseMethods, updateSubscriptionActionValidation } from '@/server/notifications/subscription/validation'
import type { ActionReturn } from '@/actions/Types'
import type { MinimizedSubscription, Subscription } from '@/server/notifications/subscription/Types'


export async function updateSubscriptionsAction(userId: number, subscriptions: MinimizedSubscription[]):
Promise<ActionReturn<Subscription[]>> {
    const { authorized, status, user } = await getUser({
        requiredPermissions: [['NOTIFICATION_SUBSCRIPTION_UPDATE']],
        userRequired: true,
    })
    if (!authorized) return createActionError(status)

    // const parse = updateSubscriptionActionValidation.typeValidate(formdata)
    // if (!parse.success) return createZodActionError(parse)


    return await safeServerCall(() => updateSubscriptions(userId, subscriptions))
}

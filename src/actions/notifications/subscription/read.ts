'use server'

import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { readUserSubscriptions } from '@/services/notifications/subscription/read'
import type { Subscription } from '@/services/notifications/subscription/Types'
import type { ActionReturn } from '@/actions/Types'

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

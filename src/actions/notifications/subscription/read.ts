'use server'

import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { readUserSubscriptions } from '@/server/notifications/subscription/read'
import type { Subscription } from '@/server/notifications/subscription/Types'
import type { ActionReturn } from '@/actions/Types'

export async function readMySubscriptionsAction():
Promise<ActionReturn<Subscription[]>> {
    const { authorized, status, user } = await getUser({
        requiredPermissions: [['NOTIFICATION_CHANNEL_READ']],
        userRequired: true,
    })

    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readUserSubscriptions(user.id))
}

"use server"
import type { ActionReturn } from '@/actions/Types'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { ServerError } from '@/server/error'
import { createNotification } from '@/server/notifications/create'

export async function createNotificaitonChannel(): Promise<ActionReturn<void>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'NOTIFICATION_CHANNEL_READ' ]],
        userRequired: true,
    });
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => {
        throw new ServerError('UNKNOWN ERROR', "Not implemented")
    });
}

export async function createNotificationAction(formdata: FormData): Promise<ActionReturn<void>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'NOTIFICATION_CREATE' ]],
        userRequired: true,
    })

    if (!authorized) return createActionError(status);

    

    return await safeServerCall(async () => {
        await createNotification(4, "Hei", "Dette skal være en ny hendelse");
    })
}
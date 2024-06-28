'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { createNotificaionValidation } from '@/server/notifications/validation'
import { dispatchNotification } from '@/server/notifications/create'
import type { ActionReturn } from '@/actions/Types'
import type { Notification } from '@prisma/client'


export async function dispatchNotificationAction(formdata: FormData): Promise<ActionReturn<{
    notification: Notification
    recipients: number
}>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['NOTIFICATION_CREATE']],
    })
    if (!authorized) return createActionError(status)

    const parse = createNotificaionValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => dispatchNotification(parse.data))
}

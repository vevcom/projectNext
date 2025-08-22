'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn } from '@/actions/Types'
import { getUser } from '@/auth/getUser'
import { dispatchNotification } from '@/services/notifications/create'
import { createNotificaionValidation } from '@/services/notifications/validation'
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

'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { updateNotificationChannel } from '@/server/notifications/channel/update'
import { parseMethods, updateNotificaionChannelValidation } from '@/server/notifications/channel/validation'
import type { NotificationChannel } from '@/server/notifications/Types'
import type { ActionReturn } from '@/actions/Types'


export async function updateNotificationChannelAction(formdata: FormData):
Promise<ActionReturn<NotificationChannel>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['NOTIFICATION_CHANNEL_UPDATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = updateNotificaionChannelValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(async () => {
        const availableMethods = parseMethods(formdata, 'availableMethods')
        const defaultMethods = parseMethods(formdata, 'defaultMethods')

        return updateNotificationChannel({
            ...parse.data,
            availableMethods,
            defaultMethods,
        })
    })
}

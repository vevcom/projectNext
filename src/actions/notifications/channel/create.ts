'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { createNotificationChannel } from '@/server/notifications/channel/create'
import { createNotificaionChannelValidation, parseMethods } from '@/server/notifications/channel/validation'
import type { ExpandedNotificationChannel } from '@/server/notifications/Types'
import type { ActionReturn } from '@/actions/Types'


export async function createNotificationChannelAction(rawdata: FormData):
Promise<ActionReturn<ExpandedNotificationChannel>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['NOTIFICATION_CHANNEL_CREATE']]
    })

    if (!authorized) return createActionError(status)

    const typeParsed = createNotificaionChannelValidation.typeValidate(rawdata)
    if (!typeParsed.success) return createZodActionError(typeParsed)

    return safeServerCall(() => {
        const availableParsed = parseMethods(rawdata, 'availableMethods')
        const defaultParsed = parseMethods(rawdata, 'defaultMethods')

        return createNotificationChannel({
            ...typeParsed.data,
            availableMethods: availableParsed,
            defaultMethods: defaultParsed,
        })
    })
}

'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn } from '@/actions/Types'
import { getUser } from '@/auth/getUser'
import { createNotificationChannel } from '@/services/notifications/channel/create'
import { readNotificationChannels } from '@/services/notifications/channel/read'
import { updateNotificationChannel } from '@/services/notifications/channel/update'
import { createNotificaionChannelValidation, parseMethods, updateNotificaionChannelValidation } from '@/services/notifications/channel/validation'
import type { ExpandedNotificationChannel } from '@/services/notifications/Types'

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

export async function readNotificationChannelsAction():
    Promise<ActionReturn<ExpandedNotificationChannel[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['NOTIFICATION_CHANNEL_READ']],
        userRequired: false,
    })

    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readNotificationChannels())
}

export async function updateNotificationChannelAction(formdata: FormData):
Promise<ActionReturn<ExpandedNotificationChannel>> {
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

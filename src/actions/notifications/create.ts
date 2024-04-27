"use server"
import type { ActionReturn } from '@/actions/Types'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { ServerError } from '@/server/error'
import { createNotification, createNotificationChannel } from '@/server/notifications/create'
import { createNotificationChannelValidation } from '@/server/notifications/validation'
import { findMethodsFromFlatObject } from '@/server/notifications/ConfigVars'

export async function createNotificaitonChannelAction(rawdata: FormData): Promise<ActionReturn<void>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'NOTIFICATION_CHANNEL_READ' ]],
        userRequired: true,
    });
    if (!authorized) return createActionError(status)

    const typeParse = createNotificationChannelValidation.typeValidate(rawdata);
    if (!typeParse.success) return createZodActionError(typeParse)


    return await safeServerCall(async () => {
        const parse = createNotificationChannelValidation.detailedValidate(typeParse.data)

        const defaultMethods = findMethodsFromFlatObject("defaultMethods", parse);
        const avav


        await createNotificationChannel({
            name: data.name,
            description: data.description,

        })
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
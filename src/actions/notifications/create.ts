"use server"

import { Notification } from "@prisma/client";
import { ActionReturn } from "../Types";
import { getUser } from "@/auth/getUser";
import { createActionError, createZodActionError } from "../error";
import { createNotificaionValidation } from "@/server/notifications/validation";
import { safeServerCall } from "../safeServerCall";
import { dispatchNotification } from "@/server/notifications/create";


export async function dispatchNotificationAction(formdata: FormData): Promise<ActionReturn<{
    notification: Notification
    recipients: number
}>> {

    const {authorized, status} = await getUser({
        requiredPermissions: [[ "NOTIFICATION_CREATE" ]],
    })
    if (!authorized) return createActionError(status);

    const parse = createNotificaionValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => dispatchNotification(parse.data))
}
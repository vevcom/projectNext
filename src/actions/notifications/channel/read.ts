"use server"

import { ActionReturn } from "@/actions/Types";
import { createActionError } from "@/actions/error";
import { safeServerCall } from "@/actions/safeServerCall";
import { getUser } from "@/auth/getUser";
import { NotificationChannel } from "@/server/notifications/Types";
import { readAllNotificationChannels } from "@/server/notifications/channel/read";



export async function readAllNotificationChannelsAction():
    Promise<ActionReturn<NotificationChannel[]>>
{
    const {authorized, status} = await getUser({
        requiredPermissions: [[ "NOTIFICATION_CHANNEL_READ" ]],
        userRequired: false,
    })

    if (!authorized) return createActionError(status);

    return await safeServerCall(() => readAllNotificationChannels());
}
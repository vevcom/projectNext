"use server"

import { ActionReturn } from "@/actions/Types";
import { createActionError, createZodActionError } from "@/actions/error";
import { safeServerCall } from "@/actions/safeServerCall";
import { getUser } from "@/auth/getUser";
import type { Subscription } from "@/server/notifications/subscription/Types";
import { updateSubscription } from "@/server/notifications/subscription/update";
import { parseMethods, updateSubscriptionActionValidation } from "@/server/notifications/subscription/validation";


export async function updateSubscriptionAction(formdata: FormData):
Promise<ActionReturn<Subscription | null>> {

    
    const { authorized, status, user } = await getUser({
        requiredPermissions: [[ "NOTIFICATION_SUBSCRIPTION_UPDATE" ]],
        userRequired: true,
    })
    if (!authorized) return createActionError(status)
    

    const parse = updateSubscriptionActionValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
            

    return await safeServerCall(async () => {
        const methods = parseMethods(formdata)

        return await updateSubscription({
            channelId: parse.data.channelId,
            userId: user.id,
            methods
        });
    })
}

"use server"
import { updateNotificationChannel } from "@/server/notifications/update"
import { safeServerCall } from "@/actions/safeServerCall";
import type { ActionReturn } from "@/actions/Types";
import type { NotificationChannelWithMethods } from "@/server/notifications/Types"
import { updateNotificationValidation } from "@/server/notifications/validation"
import type { NotificationMethodType } from "@/server/notifications/Types"
import { createActionError, createZodActionError } from "@/actions/error";
import { getUser } from "@/auth/getUser";

export async function updateNotificationChannelAction(rawdata: FormData): Promise<ActionReturn<NotificationChannelWithMethods>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'NOTIFICATION_CHANNEL_UPDATE' ]],
        userRequired: true,
    });
    if (!authorized) return createActionError(status)

    console.log(rawdata)

    const typeVerifiedData = updateNotificationValidation.typeValidate(rawdata)
    console.log(typeVerifiedData)
    if (!typeVerifiedData.success) return createZodActionError(typeVerifiedData)
    
    const results = await safeServerCall(() => {
        const parsedData = updateNotificationValidation.detailedValidate(typeVerifiedData.data)

        function countPrefix(prefix: NotificationMethodType) {
            return Object
                .entries(parsedData)
                .reduce(
                    (acc : number, [key] : string[]) => acc + (key.startsWith(`${prefix}_`) ? 1 : 0),
                    0
                )
        }

        function addMethod(prefix: NotificationMethodType) {
            const prefixIncluded = countPrefix(prefix)
            
            if (prefixIncluded === 0) {
                return {}
            }

            return {
                [prefix]: Object
                    .fromEntries(Object
                        .entries(parsedData)
                        .filter(([key]) => key.startsWith(`${prefix}_`))
                        .map(([key, value]) => [
                            key.replace(`${prefix}_`, ''),
                            value
                        ])
                    )
            }
        }

        return updateNotificationChannel({
            id: parsedData.id,
            name: parsedData.name,
            description: parsedData.description,
            parentId: parsedData.parentId,
            ...addMethod('availableMethods'),
            ...addMethod('defaultMethods'),
        })
    });

    console.log(results)

    return results;
}
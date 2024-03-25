"use server"
import { updateNotificationChannel } from "@/server/notifications/update"
import { safeServerCall } from "@/actions/safeServerCall";
import type { ActionReturn } from "@/actions/Types";
import type { NotificationChannelWithMethods } from "@/server/notifications/Types"
import { updateNotificationValidation } from "@/server/notifications/validation"
import type { NotificationMethodType } from "@/server/notifications/Types"

export async function updateNotificationChannelAction(rawdata: FormData): Promise<ActionReturn<NotificationChannelWithMethods>> {
    return await safeServerCall(() => {
        const parsedData = updateNotificationValidation.detailedValidate(rawdata)

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
                [prefix]: {
                    update: Object
                        .fromEntries(Object
                            .entries(parsedData)
                            .filter(([key]) => key.startsWith(`${prefix}_`))
                            .map(([key, value]) => [
                                key.replace(`${prefix}_`, ''),
                                { set: value }
                            ])
                        )
                }
            }
        }

        return updateNotificationChannel({
            id: parsedData.id,
            name: parsedData.name,
            description: parsedData.description,
            ...addMethod('availableMethods'),
            ...addMethod('defaultMethods'),
        })
    });
}
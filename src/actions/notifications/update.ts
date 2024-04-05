"use server"
import { updateNotificationChannel } from "@/server/notifications/update"
import { safeServerCall } from "@/actions/safeServerCall";
import type { ActionReturn } from "@/actions/Types";
import type { NotificationChannelWithMethods } from "@/server/notifications/Types"
import { updateNotificationValidation } from "@/server/notifications/validation"
import type { NotificationMethodType } from "@/server/notifications/Types"
import { createActionError, createZodActionError } from "@/actions/error";
import { getUser } from "@/auth/getUser";
import { NotificationMethod } from "@prisma/client";
import { NotificationMethodsAllOn } from "@/server/notifications/ConfigVars";

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

        function addMethod(prefix: NotificationMethodType) :
        Record<
            NotificationMethodType,
            Omit<NotificationMethod, 'id'>
        > | null {
            const prefixIncluded = countPrefix(prefix)
            
            if (prefixIncluded === 0) {
                return null
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
            } as Record<NotificationMethodType, Omit<NotificationMethod, 'id'>>
        }

        const availableMethods = addMethod('availableMethods') ?? {
            availableMethods: NotificationMethodsAllOn,
        }

        return updateNotificationChannel({
            id: parsedData.id,
            name: parsedData.name,
            description: parsedData.description,
            parentId: parsedData.parentId,
            ...availableMethods,
            ...addMethod('defaultMethods'),
        })
    });

    return results;
}

export async function updateOwnSubscription(rawdata: FormData):
    Promise<ActionReturn<null>>
{

    const { authorized, status } = await getUser({
        requiredPermissions: [
            [ 'NOTIFICATION_SUBSCRIPTION_CREATE' ],
            [ 'NOTIFICATION_SUBSCRIPTION_UPDATE' ],
    ],
        userRequired: true,
    });
    if (!authorized) return createActionError(status)

    console.log(rawdata)

    return {success: true, data: null};
}
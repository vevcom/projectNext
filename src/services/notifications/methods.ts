import '@pn-server-only'
import { dispatchEmailNotifications } from './email/dispatch'
import { notificationAuthers } from './authers'
import { notificationSchemas } from './schemas'
import { allNotificationMethodsOn, notificationMethodsArray } from './config'
import { availableNotificationMethodIncluder } from './channel/config'
import { userFilterSelection } from '@/services/users/config'
import { defineOperation } from '@/services/serviceOperation'
import { ServerOnly } from '@/auth/auther/ServerOnly'
import { z } from 'zod'
import { SpecialNotificationChannel } from '@prisma/client'
import type { Notification } from '@prisma/client'
import type { ExpandedNotificationChannel, NotificationResult } from './Types'
import type { UserFiltered } from '@/services/users/Types'

const dispathMethod = {
    email: dispatchEmailNotifications,
    emailWeekly: async () => { },
} satisfies Record<
    typeof notificationMethodsArray[number],
    ((channel: ExpandedNotificationChannel, notification: Notification, users: UserFiltered[]) => Promise<void>)
>

export function repalceSpecialSymbols(text: string, user: UserFiltered) {
    return text
        .replaceAll('%u', user.username)
        .replaceAll('%n', user.firstname)
        .replaceAll('%N', `${user.firstname} ${user.lastname}`)
}

export const notificationMethods = {
    /**
     * Creates a notification with the specified data.
     *
     * @param data - The detailed data for dispatching the notification.
     * @returns A promise that resolves with an object containing the dispatched notification and the number of recipients.
     */
    create: defineOperation({
        authorizer: () => notificationAuthers.create.dynamicFields({}),
        dataSchema: notificationSchemas.create,
        operation: async ({ prisma, data }): Promise<NotificationResult> => {
            // This prevent notifications from beeing sent during seeding
            if (process.env.IGNORE_SERVER_ONLY) {
                return {
                    notification: null,
                    recipients: 0,
                }
            }

            const notification = await prisma.notification.create({
                data: {
                    title: data.title,
                    message: data.message,
                    channel: {
                        connect: {
                            id: data.channelId,
                        },
                    },
                }
            })

            const results = await prisma.notificationChannel.findUniqueOrThrow({
                where: {
                    id: data.channelId,
                },
                include: {
                    ...availableNotificationMethodIncluder,
                    subscriptions: {
                        select: {
                            methods: {
                                select: allNotificationMethodsOn,
                            },
                            user: {
                                select: userFilterSelection,
                            },
                        },
                    },
                },
            })

            // If a userId map is sent, remove all other users.
            if (data.userIdList) {
                results.subscriptions = results.subscriptions.filter(
                    subscription => (data.userIdList && data.userIdList.includes(subscription.user.id))
                )
            }

            // TODO: Filter the users by visibility

            notificationMethodsArray.forEach(method => {
                if (!results.availableMethods[method]) {
                    return
                }

                const userFiltered = results.subscriptions
                    .filter(subscription => subscription.methods[method])
                    .map(subscription => subscription.user)

                dispathMethod[method]({
                    ...results,
                    subscriptions: undefined,
                } as ExpandedNotificationChannel, notification, userFiltered)
            })

            return {
                notification,
                recipients: results.subscriptions.length
            }
        }
    }),

    /**
     * Createses a notification to a special notification channel.
     *
     * @param special - The special notification channel to dispatch the notification to.
     * @param title - The title of the notification.
     * @param message - The message content of the notification.
     * @returns A promise that resolves with an object containing the dispatched notification and the number of recipients.
     */
    createSpecial: defineOperation({
        authorizer: ServerOnly,
        paramsSchema: z.object({
            special: z.nativeEnum(SpecialNotificationChannel),
        }),
        dataSchema: notificationSchemas.createSpecial,
        operation: async ({ prisma, params, data, session }): Promise<NotificationResult> => {
            const channel = await prisma.notificationChannel.findUniqueOrThrow({
                where: {
                    special: params.special,
                }
            })

            return await notificationMethods.create({
                session,
                bypassAuth: true,
                data: {
                    channelId: channel.id,
                    title: data.title,
                    message: data.message,
                    userIdList: data.userIdList,
                }
            })
        }
    }),
}

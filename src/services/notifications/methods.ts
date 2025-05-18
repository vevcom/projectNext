import '@pn-server-only'
import { NotificationSchemas } from './schemas'
import { NotificationConfig } from './config'
import { NotificationChannelConfig } from './channel/config'
import { dispatchEmailNotifications } from './email/dispatch'
import { dispatchPushNotifications } from './push/dispath'
import { ServiceMethod } from '@/services/ServiceMethod'
import { ServerOnly } from '@/auth/auther/ServerOnly'
import { UserConfig } from '@/services/users/config'
import { z } from 'zod'
import { SpecialNotificationChannel } from '@prisma/client'
import type { Notification } from '@prisma/client'
import type { ExpandedNotificationChannel } from './Types'
import type { UserFiltered } from '@/services/users/Types'
import { NotificationAuthers } from './authers'

export namespace NotificationMethods {

    const dispathMethod = {
        email: dispatchEmailNotifications,
        emailWeekly: async () => { },
        push: dispatchPushNotifications,
    } satisfies Record<
        typeof NotificationConfig.methods[number],
        ((channel: ExpandedNotificationChannel, notification: Notification, users: UserFiltered[]) => Promise<void>)
    >

    export function repalceSpecialSymbols(text: string, user: UserFiltered) {
        return text
            .replaceAll('%u', user.username)
            .replaceAll('%n', user.firstname)
            .replaceAll('%N', `${user.firstname} ${user.lastname}`)
    }

    /**
     * Creates a notification with the specified data.
     *
     * @param data - The detailed data for dispatching the notification.
     * @returns A promise that resolves with an object containing the dispatched notification and the number of recipients.
     */
    export const create = ServiceMethod({
        auther: () => NotificationAuthers.create.dynamicFields({}),
        dataSchema: NotificationSchemas.dispatch,
        method: async ({ prisma, data }) => {
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
                    ...NotificationChannelConfig.includer,
                    subscriptions: {
                        select: {
                            methods: {
                                select: NotificationConfig.allMethodsOn,
                            },
                            user: {
                                select: UserConfig.filterSelection,
                            },
                        },
                    },
                },
            })

            // TODO: Filter the users by visibility

            NotificationConfig.methods.forEach(method => {
                if (!results.availableMethods[method]) {
                    return
                }

                const userFiltered = results.subscriptions.filter(s => s.methods[method]).map(s => s.user)

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
    })


    /**
     * Createses a notification to a special notification channel.
     *
     * @param special - The special notification channel to dispatch the notification to.
     * @param title - The title of the notification.
     * @param message - The message content of the notification.
     * @returns A promise that resolves with an object containing the dispatched notification and the number of recipients.
     */
    export const createSpecial = ServiceMethod({
        auther: ServerOnly,
        paramsSchema: z.object({
            special: z.nativeEnum(SpecialNotificationChannel),
            title: z.string(),
            message: z.string(),
        }),
        method: async ({ prisma, params, session }) => {
            const channel = await prisma.notificationChannel.findUniqueOrThrow({
                where: {
                    special: params.special,
                }
            })

            return await create.client(prisma).execute({
                session,
                bypassAuth: true,
                data: {
                    channelId: channel.id,
                    title: params.title,
                    message: params.message,
                }
            })
        }
    })
}

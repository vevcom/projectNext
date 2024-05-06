import { dispatchEmailNotifications } from './email/dispatch'
import { dispatchPushNotifications } from './push/dispath'
import type { UserFiltered } from '@/server/users/Types'
import type { Notification } from '@prisma/client'
import type { NotificationChannel, notificationMethods } from './Types'


export const dispathMethod = {
    email: dispatchEmailNotifications,
    emailWeekly: async () => {},
    push: dispatchPushNotifications,
} satisfies Record<
    typeof notificationMethods[number],
    ((channel: NotificationChannel, notification: Notification, users: UserFiltered[]) => Promise<void>)
>

export function repalceSpecialSymbols(text: string, user: UserFiltered) {
    return text
        .replaceAll('%u', user.username)
        .replaceAll('%n', user.firstname)
        .replaceAll('%N', `${user.firstname} ${user.lastname}`)
}

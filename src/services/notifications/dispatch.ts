import { dispatchEmailNotifications } from './email/dispatch'
import { dispatchPushNotifications } from './push/dispath'
import type { UserContactInfoFiltered, UserNameFiltered } from '@/services/users/Types'
import type { Notification } from '@prisma/client'
import type { ExpandedNotificationChannel, notificationMethods } from './Types'


export const dispathMethod = {
    email: dispatchEmailNotifications,
    emailWeekly: async () => {},
    push: dispatchPushNotifications,
} satisfies Record<
    typeof notificationMethods[number],
    ((channel: ExpandedNotificationChannel, notification: Notification, users: UserContactInfoFiltered[]) => Promise<void>)
>

export function repalceSpecialSymbols(text: string, user: UserNameFiltered) {
    return text
        .replaceAll('%u', user.username)
        .replaceAll('%n', user.firstname)
        .replaceAll('%N', `${user.firstname} ${user.lastname}`)
}

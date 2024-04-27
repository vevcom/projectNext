import { UserFiltered } from "@/server/users/Types"
import { NotificationChannel, notificationMethods } from "./Types"
import { dispatchEmailNotifications } from "./email/dispatch"
import { Notification } from "@prisma/client"
import { dispatchPushNotifications } from "./push/dispath"


export const dispathMethod = {
    email: dispatchEmailNotifications,
    emailWeekly: async () => {},
    push: dispatchPushNotifications,
} satisfies Record<
    typeof notificationMethods[number],
    ((channel: NotificationChannel, notification: Notification, users: UserFiltered[]) => Promise<any>)
>
import type { ExpandedNotificationChannel, NotificationMethodGeneral } from '@/server/notifications/Types'
import type { Subscription } from '@/server/notifications/subscription/Types'


export type NotificationBranch = ExpandedNotificationChannel & {
    children: NotificationBranch[],
    subscription?: Subscription | {
        new: true,
        methods: NotificationMethodGeneral
    },
}

import type { ExpandedNotificationChannel, NotificationMethodGeneral } from '@/services/notifications/Types'
import type { Subscription } from '@/services/notifications/subscription/Types'


export type NotificationBranch = ExpandedNotificationChannel & {
    children: NotificationBranch[],
    subscription?: Subscription | {
        new: true,
        methods: NotificationMethodGeneral
    },
}

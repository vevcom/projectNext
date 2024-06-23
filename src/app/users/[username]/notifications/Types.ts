import type { NotificationChannel, NotificationMethod } from '@/server/notifications/Types'
import type { Subscription } from '@/server/notifications/subscription/Types'


export type NotificationBranch = NotificationChannel & {
    children: NotificationBranch[],
    subscription?: Subscription | {
        new: true,
        methods: NotificationMethod
    },
}

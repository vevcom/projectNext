import { allNotificationMethodsOn } from '@/services/notifications/constants'
import type { Prisma } from '@prisma/client'

export const notificationMethodIncluder = {
    methods: {
        select: allNotificationMethodsOn,
    },
} satisfies Prisma.NotificationSubscriptionInclude

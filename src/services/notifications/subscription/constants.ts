import { allNotificationMethodsOn } from '@/services/notifications/constants'
import type { Prisma } from '@/prisma-generated-pn-types'

export const notificationMethodIncluder = {
    methods: {
        select: allNotificationMethodsOn,
    },
} satisfies Prisma.NotificationSubscriptionInclude

import type { allMethodsOn } from '@/services/notifications/Types'
import type { Prisma } from '@prisma/client'


export type Subscription = Prisma.NotificationSubscriptionGetPayload<{
    include: {
        methods: {
            select: typeof allMethodsOn
        },
    }
}>

export type MinimizedSubscription = Pick<Subscription, 'channelId' | 'methods'>

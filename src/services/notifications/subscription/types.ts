import type { notificationMethodIncluder } from './constants'
import type { Prisma } from '@prisma/client'


export type Subscription = Prisma.NotificationSubscriptionGetPayload<{
    include: typeof notificationMethodIncluder
}>

export type MinimizedSubscription = Pick<Subscription, 'channelId' | 'methods'>

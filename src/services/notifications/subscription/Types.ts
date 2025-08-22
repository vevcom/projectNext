import type { NotificationSubscriptionConfig } from './config'
import type { Prisma } from '@prisma/client'


export type Subscription = Prisma.NotificationSubscriptionGetPayload<{
    include: typeof NotificationSubscriptionConfig.includer
}>

export type MinimizedSubscription = Pick<Subscription, 'channelId' | 'methods'>

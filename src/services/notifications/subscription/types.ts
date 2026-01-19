import type { notificationMethodIncluder } from './constants'
import type { Prisma } from '@/prisma-generated-pn-types'


export type Subscription = Prisma.NotificationSubscriptionGetPayload<{
    include: typeof notificationMethodIncluder
}>

export type MinimizedSubscription = Pick<Subscription, 'channelId' | 'methods'>

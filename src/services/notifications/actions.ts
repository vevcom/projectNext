'use server'

import { action } from '@/services/action'
import { notificationChannelOperations } from '@/services/notifications/channel/operations'
import { notificationOperations } from '@/services/notifications/operations'
import { notificationSubscriptionOperations } from '@/services/notifications/subscription/operations'

export const createNotificationChannelAction = action(notificationChannelOperations.create)
export const updateNotificationChannelAction = action(notificationChannelOperations.update)
export const readNotificationChannelsAction = action(notificationChannelOperations.readMany)

export const createNotificationAction = action(notificationOperations.create)

export const readNotificationSubscriptionsAction = action(notificationSubscriptionOperations.read)
export const updateNotificationSubscriptionsAction = action(notificationSubscriptionOperations.update)

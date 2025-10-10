'use server'

import { action } from '@/services/action'
import { notificationChannelMethods } from '@/services/notifications/channel/methods'
import { notificationMethods } from '@/services/notifications/methods'
import { notificationSubscriptionMethods } from '@/services/notifications/subscription/methods'

export const createNotificationChannelAction = action(notificationChannelMethods.create)
export const updateNotificationChannelAction = action(notificationChannelMethods.update)
export const readNotificationChannelsAction = action(notificationChannelMethods.readMany)

export const createNotificationAction = action(notificationMethods.create)

export const readNotificationSubscriptionsAction = action(notificationSubscriptionMethods.read)
export const updateNotificationSubscriptionsAction = action(notificationSubscriptionMethods.update)

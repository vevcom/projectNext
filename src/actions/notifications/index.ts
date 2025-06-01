'use server'

import { action } from '@/actions/action'
import { NotificationChannelMethods } from '@/services/notifications/channel/methods'
import { NotificationMethods } from '@/services/notifications/methods'
import { NotificationSubscriptionMethods } from '@/services/notifications/subscription/methods'

export const createNotificationChannelAction = action(NotificationChannelMethods.create)
export const updateNotificationChannelAction = action(NotificationChannelMethods.update)
export const readNotificationChannelsAction = action(NotificationChannelMethods.readMany)

export const createNotificationAction = action(NotificationMethods.create)

export const readNotificationSubscriptionsAction = action(NotificationSubscriptionMethods.read)
export const updateNotificationSubscriptionsAction = action(NotificationSubscriptionMethods.update)

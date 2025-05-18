'use server'

import { action } from '@/actions/action'
import { NotificationChannelMethods } from '@/services/notifications/channel/methods'

export const createNotificationChannelAction = action(NotificationChannelMethods.create)
export const updateNotificationChannelAction = action(NotificationChannelMethods.update)
export const readNotificationChannelsAction = action(NotificationChannelMethods.readMany)

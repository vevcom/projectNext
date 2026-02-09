'use server'
import { makeAction } from '@/services/serverAction'
import { notificationChannelOperations } from '@/services/notifications/channel/operations'
import { notificationOperations } from '@/services/notifications/operations'
import { notificationSubscriptionOperations } from '@/services/notifications/subscription/operations'

export const createNotificationChannelAction = makeAction(notificationChannelOperations.create)
export const updateNotificationChannelAction = makeAction(notificationChannelOperations.update)
export const readNotificationChannelsAction = makeAction(notificationChannelOperations.readMany)

export const createNotificationAction = makeAction(notificationOperations.create)

export const readNotificationSubscriptionsAction = makeAction(notificationSubscriptionOperations.read)
export const updateNotificationSubscriptionsAction = makeAction(notificationSubscriptionOperations.update)

export const sendMailAction = makeAction(notificationOperations.sendMail)

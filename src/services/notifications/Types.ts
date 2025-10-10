import type { availableNotificationMethodIncluder } from './channel/config'
import type { notificationMethodsArray, notificationMethodTypes } from './config'
import type { Notification, NotificationMethod, Prisma } from '@prisma/client'

export type NotificationMethodTypes = typeof notificationMethodTypes[number]

export type NotificationMethods = typeof notificationMethodsArray[number]

export type NotificationMethodGeneral = Omit<NotificationMethod, 'id'>

export type ExpandedNotificationChannel = Prisma.NotificationChannelGetPayload<{
    include: typeof availableNotificationMethodIncluder
}>

export type NotificationResult = {
    notification: Notification | null,
    recipients: number
}

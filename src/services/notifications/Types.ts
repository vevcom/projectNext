import type { NotificationConfig } from './config'
import type { NotificationChannelConfig } from './channel/config'
import type { NotificationMethod, Prisma } from '@prisma/client'

export type NotificationMethodTypes = typeof NotificationConfig.methodTypes[number]

export type NotificationMethods = typeof NotificationConfig.methods[number]

export type NotificationMethodGeneral = Omit<NotificationMethod, 'id'>

export type ExpandedNotificationChannel = Prisma.NotificationChannelGetPayload<{
    include: typeof NotificationChannelConfig.includer
}>

import type { NotificationChannel, NotificationMethod } from '@prisma/client'

export const notificationMethodTypes = ['availableMethods', 'defaultMethods'] as const
export type NotificationMethodTypes = typeof notificationMethodTypes[number]

export const notificationMethods = ['email', 'emailWeekly', 'push'] as const satisfies (keyof NotificationMethodGeneral)[]
export type NotificationMethods = typeof notificationMethods[number]

export type NotificationMethodGeneral = Omit<NotificationMethod, 'id'>

export type ExpandedNotificationChannel = NotificationChannel & {
    availableMethods: NotificationMethodGeneral
    defaultMethods: NotificationMethodGeneral
}

export const allMethodsOn = {
    email: true,
    emailWeekly: true,
    push: true,
} satisfies Record<NotificationMethods, boolean>

export const allMethodsOff = {
    email: false,
    emailWeekly: false,
    push: false,
} satisfies Record<NotificationMethods, boolean>

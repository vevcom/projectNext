import type { NotificationChannel as prismaNC, NotificationMethod as prismaNM } from '@prisma/client'

export const notificationMethodTypes = ['availableMethods', 'defaultMethods'] as const
export type NotificationMethodTypes = typeof notificationMethodTypes[number]

export const notificationMethods = ['email', 'emailWeekly', 'push'] as const satisfies (keyof NotificationMethod)[];
export type NotificationMethods = typeof notificationMethods[number]

export type NotificationMethod = Omit<prismaNM, 'id'>

export type NotificationChannel = prismaNC & {
    availableMethods: NotificationMethod
    defaultMethods: NotificationMethod
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

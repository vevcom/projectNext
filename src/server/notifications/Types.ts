import type { NotificationChannel as prismaNC, NotificationMethod as prismaNM } from "@prisma/client";


export const notificaionMethodTypes = ["avaiblebleMethods", "defaultMethods"] as const;
export type NotificationMethodTypes = typeof notificaionMethodTypes[number]

export type NotificationMethod = Omit<prismaNM, 'id'>

export type NotificationChannel = prismaNC & {
    availebleMethods: NotificationMethod
    defaultMethods: NotificationMethod
}

export const allMethodsOn = {
    email: true,
    emailWeekly: true,
    push: true,
} as const;

export const allMethodsOff = {
    email: false,
    emailWeekly: false,
    push: false,
} as const;
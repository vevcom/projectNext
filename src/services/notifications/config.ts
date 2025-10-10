import type { NotificationMethodGeneral } from './Types'

export const notificationMethodsDisplayMap = {
    email: 'E-post',
    emailWeekly: 'Ukentlig e-post',
} satisfies Record<keyof NotificationMethodGeneral, string>

export const allNotificationMethodsOn: NotificationMethodGeneral = {
    email: true,
    emailWeekly: true,
}

export const allNotificationMethodsOff: NotificationMethodGeneral = {
    email: false,
    emailWeekly: false,
}

export const notificationMethodTypes = ['availableMethods', 'defaultMethods'] as const
export const notificationMethodsArray = ['email', 'emailWeekly'] as const satisfies (keyof NotificationMethodGeneral)[]

import type { NotificationMethod } from './Types'


export const notificationMethodsDisplayMap = {
    email: 'E-post',
    emailWeekly: 'Ukentlig e-post',
    push: 'Push varslinger'
} satisfies Record<keyof NotificationMethod, string>

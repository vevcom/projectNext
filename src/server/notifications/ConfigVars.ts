import type { NotificationMethodGeneral } from './Types'


export const notificationMethodsDisplayMap = {
    email: 'E-post',
    emailWeekly: 'Ukentlig e-post',
    push: 'Push varslinger'
} satisfies Record<keyof NotificationMethodGeneral, string>

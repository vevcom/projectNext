import { allNotificationMethodsOn } from '@/services/notifications/config'

export const availableNotificationMethodIncluder = {
    availableMethods: {
        select: allNotificationMethodsOn,
    },
    defaultMethods: {
        select: allNotificationMethodsOn,
    },
} as const

export const INFINITE_LOOP_PREVENTION_MAX_ITERATIONS = 1000

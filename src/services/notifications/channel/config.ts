import { NotificationConfig } from '@/services/notifications/config'


export namespace NotificationChannelConfig {

    export const includer = {
        availableMethods: {
            select: NotificationConfig.allMethodsOn,
        },
        defaultMethods: {
            select: NotificationConfig.allMethodsOn,
        },
    } as const
}

export const INFINITE_LOOP_PREVENTION_MAX_ITERATIONS = 1000


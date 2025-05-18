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

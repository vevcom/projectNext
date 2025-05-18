import { NotificationConfig } from '@/services/notifications/config'


export namespace NotificationSubscriptionConfig {
    export const includer = {
        methods: {
            select: NotificationConfig.allMethodsOn,
        },
    } as const
}

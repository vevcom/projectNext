import { NotificationConfig } from '@/services/notifications/config'
import type { Prisma } from '@prisma/client'


export namespace NotificationSubscriptionConfig {
    export const includer = {
        methods: {
            select: NotificationConfig.allMethodsOn,
        },
    } satisfies Prisma.NotificationSubscriptionInclude
}

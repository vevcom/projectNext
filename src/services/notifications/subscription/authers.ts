import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export namespace NotificationSubscriptionAuthers {
    export const read = RequireUserIdOrPermission.staticFields({ permission: 'NOTIFICATION_SUBSCRIPTION_READ' })
    export const update = RequireUserIdOrPermission.staticFields({ permission: 'NOTIFICATION_SUBSCRIPTION_UPDATE' })
}

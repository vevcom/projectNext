import { RequireUserIdOrPermission } from '@/auth/auther/RequireUserIdOrPermission'

export const notificationSubscriptionAuth = {
    read: RequireUserIdOrPermission.staticFields({ permission: 'NOTIFICATION_SUBSCRIPTION_READ' }),
    update: RequireUserIdOrPermission.staticFields({ permission: 'NOTIFICATION_SUBSCRIPTION_UPDATE' }),
}

import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import '@pn-server-only'

export const notificationChannelAuth = {
    create: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_CREATE' }),
    readMany: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_READ' }),
    readDefault: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_READ' }),
    update: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_UPDATE' }),
    destroy: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_UPDATE' }),
}

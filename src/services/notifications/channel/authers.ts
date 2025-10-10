import { RequirePermission } from '@/auth/auther/RequirePermission'
import '@pn-server-only'

export const notificationChannelAuthers = {
    create: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_CREATE' }),
    read: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_READ' }),
    update: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_UPDATE' }),
    destroy: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_UPDATE' }),
}

import { RequirePermission } from '@/auth/auther/RequirePermission'
import '@pn-server-only'

export namespace NotificationChannelAuthers {
    export const create = RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_CREATE' })
    export const read = RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_READ' })
    export const update = RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_UPDATE' })
    export const destroy = RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_UPDATE' })
}

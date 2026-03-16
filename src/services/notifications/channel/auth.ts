import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import '@pn-server-only'

export const notificationChannelAuth = {
    create: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_CREATE' }),
    readMany: RequireNothing.staticFields({}),
    readDefault: RequireNothing.staticFields({}),
    update: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_UPDATE' }),
    destroy: RequirePermission.staticFields({ permission: 'NOTIFICATION_CHANNEL_UPDATE' }),
}

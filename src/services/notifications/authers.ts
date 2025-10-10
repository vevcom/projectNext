import { RequirePermission } from '@/auth/auther/RequirePermission'
import '@pn-server-only'

export const notificationAuthers = {
    create: RequirePermission.staticFields({ permission: 'NOTIFICATION_CREATE' }),
    sendMail: RequirePermission.staticFields({ permission: 'MAIL_SEND' }),
}

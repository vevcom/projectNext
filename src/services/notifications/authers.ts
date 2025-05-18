import { RequirePermission } from '@/auth/auther/RequirePermission'
import '@pn-server-only'

export namespace NotificationAuthers {
    export const create = RequirePermission.staticFields({ permission: 'NOTIFICATION_CREATE' })
    export const sendMail = RequirePermission.staticFields({ permission: 'MAIL_SEND' })
}

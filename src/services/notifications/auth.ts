import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const notificationAuth = {
    create: RequirePermission.staticFields({ permission: 'NOTIFICATION_CREATE' }),
    sendMail: RequirePermission.staticFields({ permission: 'MAIL_SEND' }),
} as const

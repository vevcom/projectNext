import { RequirePermission } from '@/auth/auther/RequirePermission'

export const ReadBadgeAuther = RequirePermission.staticFields({ permission: 'BADGE_READ' })

export const AdminBadgeAuther = RequirePermission.staticFields({ permission: 'BADGE_ADMIN' })

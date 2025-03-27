import { RequirePermission } from '@/auth/auther/RequirePermission'

export const adminScreenAuther = RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' })
export const readScreenAuther = RequirePermission.staticFields({ permission: 'SCREEN_READ' })

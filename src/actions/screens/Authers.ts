import { RequirePermission } from '@/auth/auther/RequirePermission'

export const AdminScreenAuther = RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' })
export const ReadScreenAuther = RequirePermission.staticFields({ permission: 'SCREEN_READ' })

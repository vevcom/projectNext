import { RequirePermission } from '@/auth/auther/RequirePermission'

export const AdminScreenAuther = RequirePermission({ permission: 'SCREEN_ADMIN' })
export const ReadScreenAuther = RequirePermission({ permission: 'SCREEN_READ' })

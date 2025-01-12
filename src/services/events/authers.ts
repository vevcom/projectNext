import { RequirePermission } from '@/auth/auther/RequirePermission'

export const createEventAuther = RequirePermission.staticFields({ permission: 'EVENT_CREATE' })

import { RequirePermission } from '@/auth/auther/RequirePermission'

export const adminApiKeyAuther = RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' })

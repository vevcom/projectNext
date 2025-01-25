import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export const adminApiKeyAuther = RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' })

export const readApiKeyHashedAndEncryptedAuther = RequireNothing.staticFields({})

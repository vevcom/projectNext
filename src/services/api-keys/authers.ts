import { RequirePermission } from '@/auth/auther/RequirePermission'

export const apiKeyAuthers = {
    create: RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' }),
    readMany: RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' }),
    readWithHash: RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' }),
    updateIfExpired: RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' }),
} as const

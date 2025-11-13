import { RequirePermission } from '@/auth/auther/RequirePermission'

const baseAuther = RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' })

export const apiKeyAuth = {
    create: baseAuther,
    read: baseAuther,
    readMany: baseAuther,
    readWithHash: baseAuther,
    update: baseAuther,
    updateIfExpired: baseAuther,
    destroy: baseAuther,
}

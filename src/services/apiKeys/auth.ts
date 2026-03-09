import { RequirePermission } from '@/auth/authorizer/RequirePermission'

const baseAuthorizer = RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' })

export const apiKeyAuth = {
    create: baseAuthorizer,
    read: baseAuthorizer,
    readMany: baseAuthorizer,
    readWithHash: baseAuthorizer,
    update: baseAuthorizer,
    updateIfExpired: baseAuthorizer,
    destroy: baseAuthorizer,
}

import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace ApiKeyAuthers {
    export const create = RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' })
    export const read = RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' })
    export const readMany = RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' })
    export const readWithHash = RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' })
    export const update = RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' })
    export const updateIfExpired = RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' })
    export const destroy = RequirePermission.staticFields({ permission: 'APIKEY_ADMIN' })
}

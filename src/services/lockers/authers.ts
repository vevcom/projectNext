import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace LockerAuthers {
    export const create = RequirePermission.staticFields({ permission: 'LOCKER_ADMIN' })
    export const read = RequirePermission.staticFields({ permission: 'LOCKER_USE' })
    export const readPage = RequirePermission.staticFields({ permission: 'LOCKER_USE' })
}

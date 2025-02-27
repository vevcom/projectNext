import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace LockerAuthers {
    export const create = RequirePermission.staticFields({ permission: 'LOCKER_CREATE' })
    export const read = RequirePermission.staticFields({ permission: 'LOCKER_READ' })
    export const readPage = RequirePermission.staticFields({ permission: 'LOCKER_READ' })
}

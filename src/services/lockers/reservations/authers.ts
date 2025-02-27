import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace LockerReservationAuthers {
    export const create = RequirePermission.staticFields({ permission: 'LOCKER_CREATE' })
    export const read = RequirePermission.staticFields({ permission: 'LOCKER_READ' })
    export const update = RequirePermission.staticFields({ permission: 'LOCKER_CREATE' })
}

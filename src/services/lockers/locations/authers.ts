import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace LockerLocationAuthers {
    export const create = RequirePermission.staticFields({ permission: 'LOCKER_CREATE' })
    export const readAll = RequireNothing.staticFields({})
}

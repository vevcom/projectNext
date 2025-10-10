import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequirePermission } from '@/auth/auther/RequirePermission'

export const lockerLocationAuthers = {
    create: RequirePermission.staticFields({ permission: 'LOCKER_ADMIN' }),
    readAll: RequireNothing.staticFields({}),
}

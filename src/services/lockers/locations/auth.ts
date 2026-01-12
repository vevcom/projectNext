import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const lockerLocationAuth = {
    create: RequirePermission.staticFields({ permission: 'LOCKER_ADMIN' }),
    readAll: RequireNothing.staticFields({}),
}

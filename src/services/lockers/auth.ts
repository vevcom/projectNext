import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const lockerAuth = {
    create: RequirePermission.staticFields({ permission: 'LOCKER_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'LOCKER_USE' }),
    readPage: RequirePermission.staticFields({ permission: 'LOCKER_USE' }),
}

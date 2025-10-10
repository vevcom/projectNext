import { RequirePermission } from '@/auth/auther/RequirePermission'

export const lockerAuthers = {
    create: RequirePermission.staticFields({ permission: 'LOCKER_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'LOCKER_USE' }),
    readPage: RequirePermission.staticFields({ permission: 'LOCKER_USE' }),
}

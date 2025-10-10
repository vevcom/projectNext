import { RequirePermission } from '@/auth/auther/RequirePermission'

export const lockerReservationAuthers = {
    create: RequirePermission.staticFields({ permission: 'LOCKER_USE' }),
    read: RequirePermission.staticFields({ permission: 'LOCKER_USE' }),
    update: RequirePermission.staticFields({ permission: 'LOCKER_USE' }),
}
